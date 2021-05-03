import React, { Component } from "react";

import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import Avatar from "@material-ui/core/Avatar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

import "./Header.css";
import profilePic from "../../assets/upGradPic.png";
import { Link } from "react-router-dom";

class Header extends Component {
  constructor() {
    super();
    this.state = {
      anchorEl: null,
    };
  }
  getSearchBox() {
    if (!this.props.isSearchEnabled) {
      return null;
    }
    return (
      <Input
        type="search"
        placeholder="Search…"
        disableUnderline
        className="search-box"
        startAdornment={
          <InputAdornment position="start" className="search-icon">
            <SearchIcon />
          </InputAdornment>
        }
        onChange={this.props.searchHandler}
      />
    );
  }

  getRightPanel() {
    const searchBox = this.getSearchBox();
    return (
      <div className="header-right-panel">
        {searchBox}
        <Avatar
          style={{
            borderWidth: 2,
            borderColor: "white",
            borderStyle: "solid",
            cursor: "pointer",
          }}
          aria-label="recipe"
          variant="circular"
          src={profilePic}
          onClick={(e) => {
            this.setState({ anchorEl: e.currentTarget });
          }}
        >
          UpGrad
        </Avatar>

        <Menu
          id="simple-menu"
          open={this.state.anchorEl !== null}
          onClose={() => this.setState({ anchorEl: null })}
          anchorEl={this.state.anchorEl}
          getContentAnchorEl={null}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          keepMounted
        >
          <MenuItem onClick={this.props.redirectToMyAccount}>
            <Typography>My Account</Typography>
          </MenuItem>
          <Divider variant="middle" />
          <MenuItem onClick={this.props.logoutHandler}>
            <Typography>Logout</Typography>
          </MenuItem>
        </Menu>
      </div>
    );
  }

  render() {
    const rightPanel = this.props.isLoggedIn ? this.getRightPanel() : "";
    return (
      <header className="app-header">
        <h1>
          <Link to="/home" style={{color: 'white'}}>Image Viewer</Link>
        </h1>
        {rightPanel}
      </header>
    );
  }
}

export default Header;
