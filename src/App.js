import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';

import DataLink from './DataLink/DataLink';
import logo from './logo.svg';
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Moon Shots™ Barrel Tracker</h1>
        </header>
        <DataLink />
      </div>
    );
  }
}

export default App;
