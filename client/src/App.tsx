//The main component our index.tsx file will 'inject' into our index.html file
import React from 'react';
//ties our css to the classes / id's in this file
import './App.css';

class App extends React.Component{
  render(){
    return(
      <div className="App">
        <header className="App-header">
          GoodThings
        </header>
      </div>
    )
  }
}
export default App;
