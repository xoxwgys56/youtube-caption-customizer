import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { auth } from './Auth';

export default class UserContainer extends Component {
  static propTypes = {
    prop: PropTypes,
  };

  constructor(props) {
    super(props);

    this.state = {
      user: null,
      signinFail: false,
      gapi: null,
    };

    this.signinBtn = React.createRef();
    this.onClickSignin = this.onClickSignin.bind(this);
    this.onSignOut = this.onSignOut.bind(this);

    this.updateSigninStatus = this.updateSigninStatus.bind(this);
    this.onGapiLoad = this.onGapiLoad.bind(this);
    this.failedSignin = this.failedSignin.bind(this);
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

  onGapiLoad() {
    const gapi = window.gapi;
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

    this.props.handleAuth(isSignedIn);
  }

  onClickSignin(e) {
    this.state.gapi.auth2
      .getAuthInstance()
      .signIn()
      .then(() => this.setState({ signinFail: false }))
      .catch(this.failedSignin);
  }

  failedSignin(err) {
    const msg = 'Sign in Failed by ' + err.error;
    const error = new Error(msg);
    this.setState({ signinFail: true });
    throw error;
  }

  onSignOut(e) {
    const auth2 = this.state.gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      console.log('user sign out');
    });
  }

  render() {
    let userSignin;
    if (!this.state.user) {
      let signinFailBlock = '';
      if (this.state.signinFail)
        signinFailBlock = (
          <div className="twelve columns">failed sign in. try again</div>
        );
      // if not sign in, this element include parent component's row
      // in this state, there is no search button
      userSignin = (
        <Fragment>
          {signinFailBlock}
          <div className="two columns">
            <button onClick={this.onClickSignin} ref={this.signinBtn}>
              sign in
            </button>
          </div>
        </Fragment>
      );
    }
    // not sign in, this element seperated from parent component's row
    else {
      userSignin = (
        <div className="user-container">
          <div className="row">
            <div className=" eight columns">Hello {this.state.user.name}</div>
            <div className="one columns">
              <button onClick={this.onSignOut}>sign out</button>
            </div>
          </div>
        </div>
      );
    }

    return <Fragment>{userSignin}</Fragment>;
  }
}
