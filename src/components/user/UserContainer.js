import React, { Component, Fragment } from 'react';
// import { gapi } from 'gapi-script'; // to bring gapi
import PropTypes from 'prop-types';

import { auth } from './Auth';

export default class UserContainer extends Component {
  static propTypes = {
    prop: PropTypes,
    // handleAuth: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      user: null,
    };

    this.signinBtn = React.createRef();
    this.updateUser = this.updateUser.bind(this);
    this.onSignOut = this.onSignOut.bind(this);
    this.attachSignin = this.attachSignin.bind(this);

    this.loadGapiScript = this.loadGapiScript.bind(this);
    this.updateSigninStatus = this.updateSigninStatus.bind(this);
  }

  // check user already sign in or not
  componentDidMount() {
    // let auth2 = await loadAuth2(auth.CLIENT_ID, auth.SCOPE);
    // console.log(auth2.attachClickHandler);
    // if (auth2.isSignedIn.get()) {
    //   auth2.this.updateUser(auth2.currentUser.get());
    // } else {
    //   this.attachSignin(auth2);
    // }

    const script = document.createElement('script');
    // script.onload = () => {
    //   console.log('on load script');

    //   this.loadGapiScript(script);
    // };
    script.setAttribute('defer', 'defer');
    script.setAttribute('async', 'async');
    script.src = 'https://apis.google.com/js/api.js?onload=onGapiLoad';
    window.onGapiLoad = function onGapiLoad() {
      const gapi = window.gapi;
      gapi.load('client:auth2', function () {
        gapi.client
          .init(auth)
          .then(() => {
            // console.log(gapi.auth2.getAuth);
            console.log(gapi.auth2.getAuthInstance());
            // gapi.auth2
            //   .getAuthInstance()
            //   .isSignedIn.listen(this.updateSigninStatus);

            // this.updateSigninStatus(
            //   gapi.auth2.getAuthInstance().isSignedIn.get()
            // );

            gapi.auth2.getAuthInstance().signIn();
          })
          .catch((err) => console.log(err));
      });

      // function onAuthApiLoad() {
      //   console.log('load auth', gapi.client.init(auth));
      //   gapi.client.init(auth).then(() => {
      //     // console.log(gapi.auth2.getAuth);
      //   });
      // }
    };
    document.body.appendChild(script);
  }

  updateSigninStatus(isSignedIn) {
    console.log(isSignedIn);
  }

  loadGapiScript(script) {
    console.log(script.getAttribute('gapi_processed'));
    if (script.getAttribute('gapi_processed')) {
      console.log('script is loaded');
    } else {
      console.log("Client wasn't ready, trying again in 100ms");
      // setTimeout(() => {
      //   this.loadGapiScript(script);
      // }, 1000);
    }
  }

  attachSignin(auth2) {
    // in this api, we use attachClickHandler to onClick event
    auth2.attachClickHandler(
      this.signinBtn.current,
      {},
      (user) => {
        this.updateUser(user);
      },
      (err) => {
        console.log(JSON.stringify(err));
      }
    );
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

    console.log(this.state);

    let userSignin;
    if (!user)
      // if not sign in, this element include parent component's row
      // in this state, there is no search button
      userSignin = (
        <div className="two columns">
          <button ref={this.signinBtn}>sign in</button>
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
