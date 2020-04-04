//The main component our index.tsx file will 'inject' into our index.html file
import React from 'react';
//ties our css to the classes / id's in this file
import './App.css';
//import axios which is useful for api's
import axios from 'axios';
//import router for navigating between components
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

class App extends React.Component{

  //hold data fetched from API
  state = {
    data:null
  }

  //method which stores data from our API in our state object
  //componentDidMount is a ReactJS component lifecycle method
  componentDidMount(){
    axios.get('http://localhost:5000')
      .then((response) => {
        this.setState({
          data:response.data
        })
      })
      .catch((error) => {
        console.error(`Error fetching data ${error}`);
      })
  }


  render(){
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
                <Link to="/login">Login</Link>
              </li>
            </ul>
          </header>
          <main>
            <Route exact path="/">
              {this.state.data}
            </Route>
            <Switch>
              <Route path="/register">
                &nbsp;Register
              </Route>
              <Route path="/login">
                &nbsp;Login
              </Route>
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