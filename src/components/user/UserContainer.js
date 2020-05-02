import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { auth } from './Auth';
import { ErrorMsg } from '../util/Msg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export default class UserContainer extends Component {
  static propTypes = {
    // prop: PropTypes,
    handleAuth: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      user: null,
      errorMsg: '',
      gapi: null,
    };

    this.signinBtn = React.createRef();
    this.onClickSignin = this.onClickSignin.bind(this);
    this.onSignOut = this.onSignOut.bind(this);

    this.updateSigninStatus = this.updateSigninStatus.bind(this);
    this.onGapiLoad = this.onGapiLoad.bind(this);
    this.setError = this.setError.bind(this);
  }

  // check user already sign in or not
  componentDidMount() {
    const script = document.createElement('script');

    script.setAttribute('defer', 'defer');
    script.setAttribute('async', 'async');
    script.src = 'https://apis.google.com/js/api.js?onload=onGapiLoad';
    window.onGapiLoad = this.onGapiLoad;
    document.body.appendChild(script);
  }

  // when app mounted, get gpai.
  onGapiLoad() {
    const gapi = window.gapi;
    // set gapi as state.
    this.setState({ gapi: gapi });
    const that = this;
    gapi.load('client:auth2', function () {
      gapi.client
        .init(auth)
        .then(() => {
          gapi.auth2
            .getAuthInstance()
            .isSignedIn.listen(that.updateSigninStatus);

          that.updateSigninStatus(
            gapi.auth2.getAuthInstance().isSignedIn.get()
          );
        })
        .catch((err) => console.log(err));
    });
  }

  // call back function when user sign in and out
  updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      const profile = this.state.gapi.auth2
        .getAuthInstance()
        .currentUser.get()
        .getBasicProfile();
      this.setState({
        user: {
          id: profile.getId(),
          name: profile.getName(),
          imgUrl: profile.getImageUrl(),
        },
      });
    } else {
      this.setState({ user: null });
    }
    // update VideoContainer
    this.props.handleAuth(isSignedIn);
  }

  // sign in click listener
  onClickSignin(e) {
    this.state.gapi.auth2
      .getAuthInstance()
      .signIn()
      .catch((err) => this.setError('Failed sign in. please try again.'));
  }

  onSignOut(e) {
    const auth2 = this.state.gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      console.log('user sign out');
    });
  }

  // 경고 메세지.
  setError(msg) {
    const timeOut = 6000;
    this.setState({ errorMsg: msg });
    console.log(msg);
    setTimeout(() => {
      this.setState({ errorMsg: '' });
    }, timeOut);
  }

  render() {
    let userSignin;
    // user signed in
    if (!this.state.user) {
      let error = '';
      if (this.state.errorMsg !== '')
        error = <ErrorMsg msg={this.state.errorMsg} />;
      // if not sign in, this element include parent component's row
      // in this state, there is no search button
      /**
       * 로그인한 상태가 아니라면, 이 요소는 부모(VideoSearch)의 row에 속하기 때문에 column을 사용한다.
       */
      userSignin = (
        <Fragment>
          {error}
          <button
            className="sign-in-btn two columns"
            onClick={this.onClickSignin}
            ref={this.signinBtn}
          >
            <FontAwesomeIcon icon={faSignInAlt} />
          </button>
        </Fragment>
      );
    }
    // sign in, this element seperated from parent component's row
    else {
      userSignin = (
        <Fragment>
          <div className="two columns user-img">
            <img className="user-img" src={this.state.user.imgUrl} />
          </div>
          <h5 className="five columns u-full-width">
            Hello {this.state.user.name}
          </h5>
          <button
            className="sign-out-btn two columns u-pull-right"
            onClick={this.onSignOut}
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
          </button>
        </Fragment>
      );
    }

    return <Fragment>{userSignin}</Fragment>;
  }
}
