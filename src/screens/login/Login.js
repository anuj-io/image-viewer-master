import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import { Redirect } from 'react-router';


import "./Login.css";

const customClasses = {
  FormControl: {
    root: "login-form-conrol",
  },
  Label: {
    root: "login-form-conrol__label",
  },
  Input: {
    root: "login-form-conrol__input",
  },
};


class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      isUsernameMissing: false,
      isPasswordMissing: false,
      incorrectCredentialsEntered: false,
      redirectToHome: false,
    };
  }

  passwordChangeHandler = (e) => {
    this.setState({ password: e.target.value });
  };

  usernameChangeHandler = (e) => {
    this.setState({ username: e.target.value });
  };

  handleLogin = (e) => {
    const username = 'admin';
    const password = 'password12';

    const isUsernameMissing = this.state.username.length === 0;
    const isPasswordMissing = this.state.password.length === 0;

    this.setState({ isUsernameMissing, isPasswordMissing });

    if(isUsernameMissing || isPasswordMissing) {
      return;
    }

    if(this.state.username === username && this.state.password === password) {
      this.setState({incorrectCredentialsEntered: false, redirectToHome: true});
    } else {
      this.setState({incorrectCredentialsEntered: true});
    }
  };

  render() {
    if(this.state.redirectToHome) {
      return (
        <Redirect from="/" to="/home" />
      )
    }
    return (
      <div>
        <Card
          classes={{
            root: this.props.customCardClass,
          }}
        >
          <CardContent>
            <Typography variant="h4">LOGIN</Typography>
            <FormControl classes={customClasses.FormControl} required>
              <InputLabel classes={customClasses.Label} htmlFor="username">
                Username
              </InputLabel>
              <Input
                classes={customClasses.Input}
                id="username"
                type="text"
                username={this.state.username}
                onChange={this.usernameChangeHandler}
              />
              {this.state.isUsernameMissing && (
                <FormHelperText
                  error={true}
                >
                  <span className="red">required</span>
                </FormHelperText>
              )}
            </FormControl>
            <FormControl classes={customClasses.FormControl} required>
              <InputLabel classes={customClasses.Label} htmlFor="loginPassword">
                Password
              </InputLabel>
              <Input
                classes={customClasses.Input}
                id="loginPassword"
                type="password"
                loginpassword={this.state.password}
                onChange={this.passwordChangeHandler}
              />
              {this.state.isPasswordMissing && (
                <FormHelperText
                  error={true}
                >
                  <span className="red">required</span>
                </FormHelperText>
              )}
            </FormControl>
            <FormControl classes={customClasses.FormControl}>
            {this.state.incorrectCredentialsEntered && (
                <FormHelperText
                  error={true}
                >
                  <span className="red">Incorrect username and/or password</span>
                </FormHelperText>
              )}
            </FormControl>
            <FormControl>
              <Button
                onClick={() => this.handleLogin()}
                variant="contained"
                color="primary"
              >
                Login
              </Button>
            </FormControl>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default Login;
