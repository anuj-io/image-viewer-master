import React, { Component } from "react";
import Login from "../login/Login.js";
import Header from "../../common/header/Header.js";
import "./Landing.css"

class Landing extends Component {
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

export default Landing;
