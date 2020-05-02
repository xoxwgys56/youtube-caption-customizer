import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { isMobile } from 'react-device-detect';

import Video from './Video';
import CaptionContainer from '../caption/CaptionContainer';
import VideoSearch from './VideoSearch';
import UserContainer from '../user/UserContainer';
import { WarningMsg, ErrorMsg, InfoMsg } from '../util/Msg';

class VideoContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      video: null,
      player: null,
      loading: true,
      isSignin: false,
      warningMsg: '',
      errorMsg: '',
      infoMsg: '',
    };

    // this.validateVideoLink = this.validateVideoLink.bind(this);
    this.handleAuth = this.handleAuth.bind(this);
    this.handleCaption = this.handleCaption.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onReady = this.onReady.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.onPause = this.onPause.bind(this);
    this.setTimer = this.setTimer.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.offTimer = this.offTimer.bind(this);
  }

  componentDidMount() {
    // check cookie.
    // 쿠키 확인
    const link = Cookies.get('link');
    if (link) {
      this.setState({ link: link });
    }
  }

  // check link is valid
  // 올바른 유튜브 링크인지 확인.
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
  // VideoSearch로부터 링크를 얻고 올바른 링크라면, 스테이트에 저장.
  handleSubmit(link) {
    this.offTimer();
    Cookies.set('link', link);

    // reset caption selector
    this.resetCaption();

    if (this.validateVideoLink(link)) {
      let temp = link.split('?v=')[1];
      if (!temp) {
        temp = link.split('&v=')[1];
      }
      const timeDel = '&t=';
      let video;
      // if link include time
      if (temp.includes(timeDel)) {
        const result = temp.split(timeDel);
        const id = result[0];
        const time = result[1].split('s')[0];
        video = {
          id: id,
          link: link,
          lastTime: time,
        };
        this.setState({
          video: video,
        });
        this.setTimer();
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
      // input link with signin, get caption list
      // 로그인한 상태에서 입력을 했다면 바로 자막 리스트를 가져온다.
      if (this.state.isSignin) {
        // setState is asynchronous, so we use temporary video. but value is same.
        // setState함수는 비동기적이라서, 변수로 저장된 video를 사용한다.
        this.getCaptionList(video.id);
      }
    } else {
      // not a valid link
      const msg = link + ' is not a valid youtube link.';
      this.setWarning(msg);
    }
  }

  // called only user sign-in or sign-out
  // 유저 로그인,아웃에만 호출된다.
  handleAuth(isSignedIn) {
    // if sign in, get caption
    if (isSignedIn) {
      this.setState({ isSignin: true });
      // check is there any valid link or not
      const link = document.getElementById('search-input').value;
      this.handleSubmit(link);
      // if valid link, this will be save with state data.
      if (this.state.video) {
        this.getCaptionList(this.state.video.id);
      }
    } else {
      this.setState({ isSignin: false });
    }
  }

  // 추후에 메세지 타입 만들어서 이용하거나, component 분리하면 더 좋겠다.
  // 경고 메세지.
  setWarning(msg) {
    const timeOut = 5000;
    this.setState({ warningMsg: msg });
    console.log('warning message : ', msg);
    setTimeout(() => {
      this.setState({ warningMsg: '' });
    }, timeOut);
  }
  // 에러 메세지
  setError(msg) {
    const timeOut = 4000;
    this.setState({ errorMsg: msg });
    console.log(msg);
    setTimeout(() => {
      this.setState({ errorMsg: '' });
    }, timeOut);
  }
  // 정보 메세지
  setInfo(msg) {
    const timeOut = 6000;
    this.setState({ infoMsg: msg });
    console.log(msg);
    setTimeout(() => {
      this.setState({ infoMsg: '' });
    }, timeOut);
  }

  handleCaption(eventArr) {
    // add callback function
    this.getCaptionList = eventArr[0];
    this.setVideoTime = eventArr[1];
    this.resetCaption = eventArr[2];
  }

  /** this function called when youtube player is ready */
  onReady(e) {
    // set player
    const player = e.target;
    this.setState({ player: player });

    // check is this mobile or not
    if (isMobile) return;
    if (this.state.video.lastTime) {
      player.seekTo(this.state.video.lastTime);
      player.pauseVideo();
    }
    // end loading bar
  }

  /** when player play
   * start tick(getVideoTime) by every each offset ms.
   *
   * 플레이어가 시작될 때 매 offset ms마다 getVideoTime을 호출한다.
   */
  onPlay(e) {
    this.setTimer();
  }

  onEnd(e) {
    this.offTimer();
  }

  /** when video pause this function called
   * and remove tick(getVideoTime)
   *
   * 플레이어가 일시정지될 때 이 함수가 호출되고 getVideoTime을 더 이상 호출하지 않는다.
   * 이렇기 때문에 일시정지한 상태에서는 자막이 바뀌지 않아서 현재 이 상태는 이용하지 않는다.
   */
  onPause(e) {
    // if timer exist, remove it
    // this.offTimer();
    // if (this.state.player) {
    //   const time = this.state.player.getCurrentTime();
    //   // set time to CaptionContainer
    //   this.setVideoTime(time);
    // }
  }

  /** if timer is alive, kill */
  offTimer() {
    if (this.state.timerId !== -1) {
      clearInterval(this.state.timerId);
      this.setState({ timerId: -1 });
    }
  }

  setTimer() {
    if (!this.state.player) return;
    if (this.state.timerId !== -1) return;
    const offset = 100;
    const timerId = setInterval(
      () => this.getVideoTime(this.state.player),
      offset
    );
    this.setState({ timerId: timerId });
  }
  /** called on onPlay
   * every second
   * this function called and get player's current time
   * then set CaptionContainer.state.time
   *
   * onPlay에서 호출된다.
   * 이 함수는 플레이어의 현재 플레이 시간을 갖고와서 CaptionContainer.state.time에 해당 값을 설정한다.
   */
  getVideoTime(player) {
    if (player) {
      const time = player.getCurrentTime();
      // set time to CaptionContainer
      this.setVideoTime(time);
      return time;
    } else return -1;
  }

  render() {
    const { isSignin, player, video } = this.state;

    let warning, error, info;
    if (this.state.warningMsg !== '')
      warning = <WarningMsg msg={this.state.warningMsg} />;
    if (this.state.errorMsg !== '')
      error = <ErrorMsg msg={this.state.errorMsg} />;
    if (this.state.infoMsg !== '') info = <InfoMsg msg={this.state.infoMsg} />;

    let signinUser, signoutUser;
    if (isSignin) signinUser = <UserContainer handleAuth={this.handleAuth} />;
    else signoutUser = <UserContainer handleAuth={this.handleAuth} />;
    return (
      <div className="section">
        <div className="container ">
          <Video
            video={video}
            onReady={this.onReady}
            onPlay={this.onPlay}
            onPause={this.onPause}
            onEnd={this.onEnd}
          />
          <div className="container u-full-width">
            <div className="row">
              {/* 10 cols */}
              <VideoSearch
                isSignin={isSignin}
                handleSubmit={this.handleSubmit}
                video={video}
              />
              {signoutUser}
            </div>
            {/* when user sign in */}
            <div className="row u-full-width user-container">{signinUser}</div>
          </div>
          <CaptionContainer
            video={this.state.video}
            isSignIn={isSignin}
            handleCaption={this.handleCaption}
            player={player}
          />
          {error}
          {warning}
          {info}
        </div>
      </div>
    );
  }
}

export default VideoContainer;
