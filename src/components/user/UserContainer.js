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
    };

    this.gapi = null;

    this.signinBtn = React.createRef();
    this.updateUser = this.updateUser.bind(this);
    this.onClickSignin = this.onClickSignin.bind(this);
    this.onSignOut = this.onSignOut.bind(this);

    this.updateSigninStatus = this.updateSigninStatus.bind(this);
    this.onGapiLoad = this.onGapiLoad.bind(this);
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
    // this.setState({ gapi: window.gapi });
    const gapi = window.gapi;
    this.gapi = window.gapi;
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
    console.log(isSignedIn);
  }

  onClickSignin(e) {
    console.log(this.gapi);
    this.gapi.auth2.getAuthInstance().signIn();
  }

  updateUser(curUser) {
    // const profile = curUser.getBasicProfile();
    // const name = profile.getName();
    // const profileImg = profile.getImageUrl();
    // this.setState({
    //   user: {
    //     name: name,
    //     profileImg: profileImg,
    //   },
    // });
  }

  onSignOut(e) {
    // const auth2 = gapi.auth2.getAuthInstance();
    // auth2.signOut().then(() => {
    //   this.setState({ user: null });
    //   console.log('user sign out');
    // });
  }

  render() {
    const user = this.state.user;

    // console.log(this.state);

    let userSignin;
    if (!user)
      // if not sign in, this element include parent component's row
      // in this state, there is no search button
      userSignin = (
        <div className="two columns">
          <button onClick={this.onClickSignin} ref={this.signinBtn}>
            sign in
          </button>
        </div>
      );
    // not sign in, this element seperated from parent component's row
    else
      userSignin = (
        <div className="user-container">
          <div className="row">
            <div className=" eleven column"></div>
            <button onClick={this.onSignOut}>sign out</button>
          </div>
        </div>
      );

    return <Fragment>{userSignin}</Fragment>;
  }
}
