import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";

import Grid from "@material-ui/core/Grid";

import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";

import Avatar from "@material-ui/core/Avatar";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import { Redirect } from "react-router";
import Header from "../../common/header/Header.js";
import profilePic from "../../assets/upGradPic.png";

import "./Home.css";

const customClasses = {
  Card: {
    root: "image-card",
  },
  CardMedia: {
    root: "custom-card-media",
  },
};

const classes = {
  avatar: "image-card-avatar",
};

function getFormattedTimeStamp(timestamp) {
  const date = new Date(timestamp);

  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}: ${date.getSeconds()}`;
}

class Home extends Component {
  constructor() {
    super();

    this.state = {
      isLoggedIn: window.sessionStorage.getItem("accessToken") !== null,
      token: window.sessionStorage.getItem("accessToken"),
      images: [],
    };
    this.getImgCard = this.getImgCard.bind(this);
    this.getLikeActionBar = this.getLikeActionBar.bind(this);
    this.getComments = this.getComments.bind(this);
    this.getCommentActionBar = this.getCommentActionBar.bind(this);
  }

  getCommentActionBar(img, idx) {
    let newComment;
    return (
      <FormControl style={{display: 'flex', flexDirection: 'row'}}>
        <InputLabel htmlFor="addComment">
          Add a comment
        </InputLabel>
        <Input
          style={{flexGrow: 1}}
          htmlFor="addComment"
          onChange={(e) => {
            newComment = e.target.value;
          }}
        />
        <Button
          style={{marginLeft: 15}}
          onClick={() => {
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

  getLikeActionBar(img, idx) {
    const totalLikes = img.selfLiked ? img.likes + 1 : img.likes;
    const label = img.totalLikes > 1 ? "likes" : "like";
    const fullLabel = `${totalLikes} ${label}`;
    const color = img.selfLiked ? { color: "red" } : { color: "grey" };
    return (
      <IconButton
        aria-label="add to favorites"
        onClick={() => {
          const newImages = Array.from(this.state.images);
          newImages[idx].selfLiked = !img.selfLiked;
          this.setState({ images: newImages });
        }}
      >
        <FavoriteIcon style={color} />
        <Typography style={{ margin: 10 }}>{fullLabel}</Typography>
      </IconButton>
    );
  }

  getComments(img, idx) {
    return img.comments.map((comment, index) => {
      return <Typography color="textPrimary" style={{padding: 20}}><b>{index+1}. </b> {comment}</Typography>;
    });
  }

  getImgCard(img, idx) {
    const formattedTimeStamp = getFormattedTimeStamp(img.timestamp);
    const likeActionBar = this.getLikeActionBar(img, idx);
    const comments = this.getComments(img);
    const commentActionBar = this.getCommentActionBar(img, idx);
    return (
      <Grid item xs={6} key={img.id}>
        <Card classes={customClasses.Card}>
          <CardHeader
            avatar={
              <Avatar
                aria-label="recipe"
                className={classes.avatar}
                variant="circular"
                src={profilePic}
              >
                UpGrad
              </Avatar>
            }
            title={img.username}
            subheader={formattedTimeStamp}
          />
          <CardMedia classes={customClasses.CardMedia} image={img.media_url} />
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              {img.caption}
            </Typography>
          </CardContent>
          <CardActions>{likeActionBar}</CardActions>
          <CardContent>{comments}</CardContent>
          <CardActions style={{display: 'block'}}>{commentActionBar}</CardActions>
        </Card>
      </Grid>
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
              imageObject.caption = res.data[idx].caption;
              imageObject.likes = Math.floor(Math.random() * 100);
              imageObject.comments = [];
            });
            this.setState({ images: data });
          });
      });
  }

  render() {
    const images = this.state.images;
    const cardList =
      images.length > 0 ? this.state.images.map(this.getImgCard) : "";
    if (!this.state.isLoggedIn) {
      return <Redirect from="/home" to="/" />;
    }
    return (
      <div>
        <Header />
        <div className="home-ctr">
          <Grid
            alignContent="center"
            container
            spacing={2}
            justify="flex-start"
            direction="row"
          >
            {cardList}
          </Grid>
        </div>
      </div>
    );
  }
}

export default Home;
