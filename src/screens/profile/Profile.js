import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Avatar from "@material-ui/core/Avatar";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Divider from "@material-ui/core/Divider";

import FormHelperText from "@material-ui/core/FormHelperText";
import { Redirect } from "react-router";

import Fab from "@material-ui/core/Fab";
import EditIcon from "@material-ui/icons/Edit";
import Modal from "@material-ui/core/Modal";

import Header from "../../common/header/Header.js";
import profilePic from "../../assets/upGradPic.png";

import "./Profile.css";

const getHashtags = (caption) => {
  const hashTagString = caption
    .split(" ")
    .filter((word) => word.indexOf("#") === 0)
    .join(" ");
  const captionString = caption
    .split(" ")
    .filter((word) => word.indexOf("#") !== 0)
    .join(" ");

  return {
    hashTagString,
    captionString,
  };
};

const customClasses = {
  FormControl: {
    root: "edit-form-conrol",
  },
  Label: {
    root: "edit-form-conrol__label",
  },
  Input: {
    root: "edit-form-conrol__input",
  },
};

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn:
        window.sessionStorage.getItem("accessToken") &&
        window.sessionStorage.getItem("accessToken").length > 0,
      token: window.sessionStorage.getItem("accessToken"),
      images: [],
      numFollowing: Math.floor(Math.random() * 1000),
      numFollowers: Math.floor(Math.random() * 1000),
      userName: "",
      name: "John Doe",
      isNameEditModalOpen: false,
      selectedImageIdx: -1,
    };

    this.redirectToMyAccount = this.redirectToMyAccount.bind(this);
    this.logoutHandler = this.logoutHandler.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.unSelectImage = this.unSelectImage.bind(this);
  }

  unSelectImage() {
    this.setState({ selectedImageIdx: -1 });
  }

  getCommentActionBar(img, idx) {
    let newComment;
    return (
      <FormControl style={{ display: "flex", flexDirection: "row" }}>
        <InputLabel htmlFor="addComment">Add a comment</InputLabel>
        <Input
          style={{ flexGrow: 1 }}
          htmlFor="addComment"
          onChange={(e) => {
            newComment = e.target.value;
          }}
        />
        <Button
          style={{ marginLeft: 15 }}
          onClick={() => {
            const idx = this.state.selectedImageIdx;
            const newImages = Array.from(this.state.images);
            newImages[idx].comments.push(newComment);
            this.setState({ images: newImages });
          }}
          variant="contained"
          color="primary"
        >
          ADD
        </Button>
      </FormControl>
    );
  }

  getLikeActionBar() {
    const img = this.state.images[this.state.selectedImageIdx];
    const totalLikes = img.selfLiked ? img.likes + 1 : img.likes;
    const label = img.totalLikes > 1 ? "likes" : "like";
    const fullLabel = `${totalLikes} ${label}`;
    const color = img.selfLiked ? { color: "red" } : { color: "grey" };
    return (
      <IconButton
        aria-label="add to favorites"
        onClick={() => {
          const idx = this.state.selectedImageIdx;
          const newImages = Array.from(this.state.images);
          newImages[idx].selfLiked = !img.selfLiked;
          this.setState({ images: newImages });
        }}
        style={{padding: 0}}
      >
        <FavoriteIcon style={color} />
        <Typography style={{ margin: 10 }}>{fullLabel}</Typography>
      </IconButton>
    );
  }

  getComments() {
    const img = this.state.images[this.state.selectedImageIdx];
    return img.comments.map((comment, index) => {
      return (
        <Typography color="textPrimary" style={{ paddingBottom: 10 }} key={this.state.selectedImageIdx+"comment"+index}>
          <b>{img.username}. </b> {comment}
        </Typography>
      );
    });
  }

  getImageModal() {
    if (this.state.selectedImageIdx === -1) {
      return null;
    }
    const img = this.state.images[this.state.selectedImageIdx];
    const likeActionBar = this.getLikeActionBar();
    const comments = this.getComments();
    const commentActionBar = this.getCommentActionBar();
    return (
      <Modal open={true} onClose={this.unSelectImage} className="img-modal">
        <div
          className="modal-body"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            position: "relative",
          }}
        >
          <div className="modal-block-ctr">
            <div className="modal-block">
              <img src={img.media_url} alt={img.caption} />
            </div>
            <div className="modal-block">
              <div className="profile-header-blk">
                <Avatar
                  style={{
                    height: 40,
                    width: 40,
                  }}
                  aria-label="recipe"
                  variant="circular"
                  src={profilePic}
                >
                  {this.state.userName}
                </Avatar>
                <Typography variant="h6" style={{ marginLeft: 20 }}>
                  {this.state.userName}
                </Typography>
              </div>
              <Divider variant="fullWidth" />
              <div style={{paddingTop: 20}}>
                <Typography variant="body2" color="textSecondary" component="p">
                  {img.caption}
                </Typography>
                <Typography
                  variant="body2"
                  style={{ color: "#0ab7ff" }}
                  component="p"
                >
                  {img.hashTags}
                </Typography>
              </div>
              <div style={{paddingTop: 20}}>
                {comments}
              </div>
              <div style={{position: "absolute", bottom: 10, right: 10, left: 10}}>
                {likeActionBar}
                {commentActionBar}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  getImageGrid() {
    return (
      <div className="image-section">
        <GridList cols={3} cellHeight={600}>
          {this.state.images.map((image, idx) => (
            <GridListTile
              onClick={() => this.setState({ selectedImageIdx: idx })}
              key={image.id}
            >
              <img
                src={image.media_url}
                alt={image.caption}
                style={{ cursor: "pointer" }}
              />
            </GridListTile>
          ))}
        </GridList>
      </div>
    );
  }

  redirectToMyAccount() {
    this.setState({ redirectToMyAccount: true });
  }

  logoutHandler() {
    sessionStorage.setItem("accessToken", "");
    this.setState({ isLoggedIn: false });
  }

  toggleModal() {
    this.setState({ isNameEditModalOpen: !this.state.isNameEditModalOpen });
  }

  getEditModal() {
    let updatedName = "";
    if (!this.state.isNameEditModalOpen) {
      return "";
    }
    return (
      <Modal open={true} onClose={this.toggleModal} className="modal">
        <div
          className="modal-body"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            position: "relative",
          }}
        >
          <FormControl>
            <Typography variant="h4">Edit</Typography>
          </FormControl>
          <FormControl classes={customClasses.FormControl} required>
            <InputLabel htmlFor="fullName" classes={customClasses.Label}>
              Full Name
            </InputLabel>
            <Input
              id="fullName"
              type="text"
              classes={customClasses.Input}
              onChange={(e) => (updatedName = e.target.value)}
            />
            {this.state.isUpdatedNameMissing && (
              <FormHelperText error={true}>
                <span className="red">required</span>
              </FormHelperText>
            )}
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (updatedName.length > 0) {
                this.setState({
                  name: updatedName,
                  isUpdatedNameMissing: false,
                  isNameEditModalOpen: false,
                });
              } else {
                this.setState({ isUpdatedNameMissing: true });
              }
            }}
          >
            UPDATE
          </Button>
        </div>
      </Modal>
    );
  }

  getInfoSection() {
    return (
      <div className="profile-header">
        <div className="profile-header-blk">
          <Avatar
            style={{
              height: 160,
              width: 160,
            }}
            aria-label="recipe"
            variant="circular"
            src={profilePic}
          >
            {this.state.userName}
          </Avatar>
        </div>
        <div className="profile-header-blk right">
          <Typography variant="h4">{this.state.userName}</Typography>
          <div className="profile-header-stats-blks">
            <div>Posts: {this.state.images.length}</div>
            <div>Follows: {this.state.numFollowing}</div>
            <div>Followed By: {this.state.numFollowers}</div>
          </div>
          <div>
            <Typography variant="h6">
              <span>{this.state.name}</span>
              <Fab
                size="medium"
                color="secondary"
                aria-label="edit"
                className="edit-icon"
                onClick={this.toggleModal}
                style={{ marginLeft: 15 }}
              >
                <EditIcon />
              </Fab>
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  componentWillMount() {
    const imgPromiseArr = [];
    fetch(
      `https://graph.instagram.com/me/media?fields=id,caption&access_token=${this.state.token}`
    )
      .then((resJson) => resJson.json())
      .then((res) => {
        const imgIdList = res.data.map(({ id }) => id);

        imgIdList.forEach((id) => {
          imgPromiseArr.push(
            fetch(
              `https://graph.instagram.com/${id}?fields=id,media_type,media_url,username,timestamp&access_token=${this.state.token}`
            )
          );
        });
        Promise.all(imgPromiseArr)
          .then((responses) => Promise.all(responses.map((res) => res.json())))
          .then((data) => {
            data.forEach((imageObject, idx) => {
              const { hashTagString, captionString } = getHashtags(
                res.data[idx].caption
              );
              imageObject.caption = captionString;
              imageObject.hashTags = hashTagString;
              imageObject.likes = Math.floor(Math.random() * 100);
              imageObject.comments = [];
            });
            this.setState({ images: data, userName: data[0].username });
          });
      })
      .catch((e) => console.log("Instagram API call failed", e));
  }

  render() {
    if (!this.state.isLoggedIn) {
      return <Redirect from="/home" to="/" />;
    }
    const infoSection = this.getInfoSection();
    const editNameModal = this.getEditModal();
    const imageGrid = this.getImageGrid();
    const imageModal = this.getImageModal();
    return (
      <div>
        <Header
          isLoggedIn={true}
          redirectToMyAccount={this.redirectToMyAccount}
          logoutHandler={this.logoutHandler}
        />
        <div className="profile-ctr">
          {infoSection}
          {editNameModal}
          {imageGrid}
          {imageModal}
        </div>
      </div>
    );
  }
}

export default Profile;
