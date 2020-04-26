import React, { Component } from 'react';
import Cookies from 'js-cookie';

import Video from './Video';
import CaptionContainer from '../caption/CaptionContainer';
// import VideoController from './VideoController';
import VideoSearch from './VideoSearch';
import UserContainer from '../user/UserContainer';
// import { faCookie } from '@fortawesome/free-solid-svg-icons';

class VideoContainer extends Component {
  constructor() {
    super();
    this.state = {
      video: null,
      player: null,
      loading: true,
      isSignin: false,
    };

    this.validateVideoLink = this.validateVideoLink.bind(this);
    this.handleAuth = this.handleAuth.bind(this);
    this.handleCaption = this.handleCaption.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onReady = this.onReady.bind(this);
  }

  componentDidMount() {
    const link = Cookies.get('link');
    if (link) {
      this.setState({ link: link });
    }
  }

  onPlay(e) {
    console.log('video play');
    const player = e.target;
    console.log(player);
    console.log(player.getCurrentTime());
  }

  onPause(e) {
    console.log('video pause');
  }

  // check link is valid
  validateVideoLink = (link) => {
    if (link !== undefined || link !== '') {
      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
      var match = link.match(regExp);
      if (match && match[2].length === 11) {
        return true;
      } else return false;
    }
  };

  // get link from VideoSearch
  handleSubmit(link) {
    if (this.validateVideoLink(link)) {
      const temp = link.split('?v=')[1];
      const timeDel = '&t=';
      let video;
      // if link include time
      if (temp.includes(timeDel)) {
        const result = temp.split(timeDel);
        const id = result[0];
        const time = result[1];
        video = {
          id: id,
          link: link,
          lastTime: time,
        };
        this.setState({
          video: video,
        });
      } else {
        // no time
        const id = temp.split('&')[0];
        video = {
          id: id,
          link: link,
        };
        this.setState({
          video: video,
        });
      }

      if (this.state.isSignin) {
        // setState not effect immediately, so we use temporary video. but value is same.
        if (this.state.video) this.getCaptionList(this.state.video.id);
        else this.getCaptionList(video.id);
      }
    } else {
      // not a valid link
      console.log(link, ' is not a valid youtube link.');
    }
  }

  // called only user sign-in or sign-out
  handleAuth(isSignedIn) {
    // if sign in, get caption
    if (isSignedIn) {
      this.setState({ isSignin: true });
      // user enter with address, get caption list
      if (this.state.video) {
        this.getCaptionList(this.state.video.id);
      } else {
        console.log('no video info');
      }
    } else {
      this.setState({ isSignin: false });
    }
  }

  handleCaption(e) {
    // add callback function
    this.getCaptionList = e;
  }

  // onControllerChange(e) {
  //   console.log(e.target.value);
  // }

  onReady(e) {
    // set player
    this.setState({ plyaer: e.target });
    // end loading bar
  }

  render() {
    return (
      <div className="section">
        <div className="container">
          <Video
            video={this.state.video}
            // id={'L42F5LV1mQs'}
            onReady={this.onReady}
            onPlay={this.onPlay}
            onPause={this.onPause}
          />
          <div className="container">
            <VideoSearch
              isSignin={this.state.isSignin}
              handleSubmit={this.handleSubmit}
              video={this.state.video}
            >
              <UserContainer handleAuth={this.handleAuth} />
            </VideoSearch>
          </div>
          <CaptionContainer
            isSignIn={this.state.isSignin}
            handleCaption={this.handleCaption}
            video={this.state.video}
          />
          {/* <VideoController onControllerChange={this.onControllerChange} /> */}
        </div>
      </div>
    );
  }
}

export default VideoContainer;
