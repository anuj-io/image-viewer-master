import React, { Component } from "react";
import Login from "../../screens/login/Login.js";
import Header from "../../common/header/Header.js";
import "./Home.css"

class Home extends Component {
  render() {
    return (
      <div>
        <Header />
        <div className="home-login-cotainer">
          <Login customCardClass='home-login' />
        </div>
      </div>
    );
  }
}

export default Home;
