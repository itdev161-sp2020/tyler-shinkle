//The main component our index.tsx file will 'inject' into our index.html file
import React from 'react';
//ties our css to the classes / id's in this file
import './App.css';
//import axios which is useful for api's
import axios from 'axios';
//import router for navigating between components
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
//import our register / login components
import Register from './components/Register/Register';
import Login from './components/Login/Login';

class App extends React.Component{

  //hold data fetched from API
  state = {
    posts: [],
    token:null, 
    user:null
  }

  //method which stores data from our API in our state object
  //componentDidMount is a ReactJS component lifecycle method
  componentDidMount(){
      this.authenticateUser();
  }

  loadData(){
    const {token} = this.state;

    if(token){
      const config ={
        headers:{
          'x-auth-token':token
        }
      };
      axios.get('http://localhost:5000/api/posts',config)
        .then(response => {
          this.setState({
            posts: response.data
          });
        })
        .catch(error => {
          console.error(`Error fetching data ${error}`);
        });
    }
  }

  //authenticate user 4/2020
  authenticateUser = () => {
    const token = localStorage.getItem('token');

    if(!token){
      localStorage.removeItem('user')
      this.setState({
        token: null,
      });
    }

    if(token){
      const config = {
        headers: {
          'x-auth-token' : token
        }
      }
      axios.get('http://localhost:5000/api/auth',config)
        .then((response)=>{
          localStorage.setItem('user',response.data.name)
          this.setState({
            user: response.data.name,
            token: token
          },
          ()=>{
            this.loadData();
          });
        })
        .catch((error) =>{
          localStorage.removeItem('user');
          this.setState({user: null});
          console.error(`Error logging in: ${error}`);
        })
    }
  }

  logOut = () =>{
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.setState({user: null, token: null});
  }


  render(){
    let {user, posts } = this.state;
    const authProps ={
      authenticateUser: this.authenticateUser
    };

    return(
      //return a series of elements witin router tags, 
      //we can navigate between components within these router tags
      //<Link to ="path">TEXT</Link>
      //exact path only triggers with exact paths, not extensions of 
      //a path
      <Router>
        <div className="App">
          <header className="App-header">
            <h1>GoodThings</h1>
            <ul>
              <li>
                <Link to ="/">Home</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
              <li>
                {user ?
                  <Link to="" onClick={this.logOut}>Log out</Link> :
                  <Link to="/login">Log in</Link>
                }
              </li>
            </ul>
          </header>
          <main>
            <Route exact path="/">
              {user? (
                <React.Fragment>
                  <div>Hello {user}!</div>
                  <div>
                    {posts.map(post=>(
                      <div key={post.id}>
                        <h1>{post.title}</h1>
                        <p>{post.body}</p>
                      </div>
                    ))}
                  </div>
                </React.Fragment>
              ):(
                <React.Fragment>
                  Please Register or Login
                </React.Fragment>
              )}
            </Route>
            <Switch>
              <Route 
                exact path ="/register" 
                render={() => <Register {...authProps}/>} 
              />
              <Route 
                exact path ="/login" 
                render={() => <Login {...authProps}/>}
                //completed Activity #8
              />
            </Switch>
          </main>
        </div>
      </Router>
    )
  }
}
export default App;
//run both ends concurrently
//npm run dev