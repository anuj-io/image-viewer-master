import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Landing from './landing/Landing';
import Home from './home/Home';

class Controller extends Component {

  constructor() {
    super();
    this.baseUrl = "";
  }
  render() {
    return (
      <Router>
        <div className="main-container">
          <Route exact path='/' render={(props) => <Landing {...props} baseUrl={this.baseUrl} />} />
          <Route exact path='/home' render={(props) => <Home {...props} baseUrl={this.baseUrl} />} />
        </div>
      </Router>
    )
  }
}

export default Controller;

