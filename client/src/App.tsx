//The main component our index.tsx file will 'inject' into our index.html file
import React from 'react';
//ties our css to the classes / id's in this file
import './App.css';
//import axios which is useful for api's
import axios from 'axios';

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
      <div className="App">
        <header className="App-header">
          GoodThings
        </header>
        {this.state.data}
      </div>
    )
  }
}
export default App;
//run both ends concurrently
//npm run dev