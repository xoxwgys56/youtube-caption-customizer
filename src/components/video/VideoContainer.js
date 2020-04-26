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
    };

    this.validateVideoLink = this.validateVideoLink.bind(this);
    this.handleAuth = this.handleAuth.bind(this);
    this.handleCaption = this.handleCaption.bind(this);
  }

  // video : {
  //   id:
  //   link:
  //   lastTime
  // }

  componentDidMount() {
    console.log('mounted');

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
  handleSearch = (link) => {
    // save to cookie
    Cookies.set('link', link);

    // check validate link
    const valid = (link) => {
      if (link !== undefined || link !== '') {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
        var match = link.match(regExp);
        if (match && match[2].length === 11) {
          return true;
        } else return false;
      }
    };

    if (valid(link)) {
      const temp = link.split('?v=')[1];

      const timeDel = '&t=';
      if (temp.includes(timeDel)) {
        const result = temp.split(timeDel);
        const id = result[0];
        const time = result[1];

        this.setState({
          video: {
            id: id,
            link: link,
            lastTime: time,
          },
        });
      } else {
        // no time
        const id = temp.split('&')[0];
        this.setState({
          video: {
            id: id,
            link: link,
          },
        });
      }
    } else {
      console.log(link, ' is not a valid youtube link.');
    }
  };

  handleAuth(isSignedIn) {
    if (isSignedIn) {
      this.getCaption(this.state.video.id);
    }
  }

  handleCaption(e) {
    this.getCaption = e;
  }

  // onControllerChange(e) {
  //   console.log(e.target.value);
  // }

  onReady(e) {
    // set player
    console.log('video is ready');
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
              signin={this.state.signin}
              handleSubmit={this.handleSearch}
              video={this.state.video}
            >
              <UserContainer handleAuth={this.handleAuth} />
            </VideoSearch>
          </div>
          <CaptionContainer
            handleCaption={this.handleCaption}
            video={this.props.video}
          />
          {/* <VideoController onControllerChange={this.onControllerChange} /> */}
        </div>
      </div>
    );
  }
}

export default VideoContainer;
