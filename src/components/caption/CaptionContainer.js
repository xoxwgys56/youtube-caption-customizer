import React, { Component } from 'react';
import { parse } from 'subtitle';
import CaptionItem from './CaptionItem';
import { ErrorMsg, WarningMsg, InfoMsg } from '../util/Msg';

import srtFile from './kor.srt';
import CaptionSelector from './CaptionSelector';
import CaptionConfig from './CaptionConfig';

class CaptionContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      caption: null,
      languageList: [],
      time: 0,
      errorMsg: '',
      warningMsg: '',
      infoMsg: '',
      currentLanguage: '',
      config: null,
    };

    this.container = React.createRef();
    this.getCaptionList = this.getCaptionList.bind(this);
    this.onChangeSelect = this.onChangeSelect.bind(this);
    this.getCaptions = this.getCaptions.bind(this);
    this.setVideoTime = this.setVideoTime.bind(this);
    this.getCaptionIndexByTime = this.getCaptionIndexByTime.bind(this);
    this.getBunchOfCaption = this.getBunchOfCaption.bind(this);
    this.onChangeConfig = this.onChangeConfig.bind(this);
    this.resetCaption = this.resetCaption.bind(this);
    this.getTestCaption = this.getTestCaption.bind(this);

    // test caption if exceed limitation.
    this.getTestCaption();
  }

  componentDidMount() {
    // console.log(this.container.current);
    const e = [];
    e.push(this.getCaptionList);
    e.push(this.setVideoTime);
    e.push(this.resetCaption);
    this.props.handleCaption(e);
  }

  getTestCaption() {
    fetch(srtFile)
      .then((rep) => rep.text())
      .then((data) => {
        // const encode = unescape(encodeURIComponent(data));
        // console.log(encode);
        const decode = decodeURIComponent(escape(data));
        const srt = parse(decode);

        // whatever, it is works...
        this.setState({ caption: srt });
      })
      .catch((err) => console.log(err));
  }

  resetCaption() {
    this.setState({
      caption: null,
      languageList: [],
    });
  }

  // 추후에 메세지 타입 만들어서 이용하거나, component 분리하면 더 좋겠다.
  // 경고 메세지.
  setWarning(msg) {
    const timeOut = 6000;
    this.setState({ warningMsg: msg });
    console.log('warning message : ', msg);
    setTimeout(() => {
      this.setState({ warningMsg: '' });
    }, timeOut);
  }
  // 에러 메세지
  setError(msg) {
    const timeOut = 6000;
    this.setState({ errorMsg: msg });
    console.log('error message : ', msg);
    setTimeout(() => {
      this.setState({ errorMsg: '' });
    }, timeOut);
  }
  // 정보 메세지
  setInfo(msg) {
    const timeOut = 10000;
    this.setState({ infoMsg: msg });
    console.log(msg);
    setTimeout(() => {
      this.setState({ infoMsg: '' });
    }, timeOut);
  }

  // get caption language list
  getCaptionList(videoId) {
    this.setState({ id: videoId });

    const gapi = window.gapi;
    // return;
    gapi.client.youtube.captions
      .list({
        part: 'snippet',
        videoId: videoId,
      })
      .then((rep) => {
        // load caption list
        const items = rep.result.items;
        const captionList = [];
        items.forEach((item) => {
          const caption = { id: item.id, language: item.snippet.language };
          captionList.push(caption);
        });
        this.setState({ languageList: captionList });
      })
      .catch((err) => {
        this.setError('Sorry, we could not load caption list');
        throw err;
      });
  }

  setVideoTime(time) {
    this.time = time;
    this.setState({ time: time });
  }

  onChangeSelect(id) {
    if (id) {
      this.getCaptions(id);
    }
  }

  // after user choose caption's language
  getCaptions(captionId) {
    // return;
    const gapi = window.gapi;
    gapi.client.youtube.captions
      .download({
        id: captionId,
        tfmt: 'srt',
      })
      .then((rep) => {
        const decode = decodeURIComponent(escape(rep.body));
        const captions = parse(decode);
        this.setState({ caption: captions });
        // console.log(captions);
      })
      .catch((err) => {
        this.setError('can not download caption');
        throw err;
      });
  }

  getCaptionIndexByTime() {
    const time = this.state.time * 1000;
    const captions = this.state.caption;
    // this means there is no caption yet.
    if (captions[0].start > time) return '';
    // console.log(captions);
    const result = [];
    for (let i = 0; i < captions.length; i++) {
      const caption = captions[i];
      if (caption.start <= time && caption.end >= time) {
        result.push(i);
      }
      if (caption.start > time) break;
    }
    return result;
  }

  getBunchOfCaption() {
    const bunch = [];

    // no caption.
    const captions = this.state.caption;
    if (!captions) return bunch;
    const indexes = this.getCaptionIndexByTime();
    // there is no caption
    if (indexes.length === 0) return bunch;

    const emptyItem = { start: 0, end: 0, text: '', primary: false };

    let index = indexes[0];
    // push current caption
    for (let i = 0; i < indexes.length; i++) {
      const caption = captions[index++];
      caption.primary = true;
      if (caption) bunch.push(caption);
      // exception of last caption
      else bunch.push(emptyItem);
    }
    if (this.state.config.checkSideCaption) {
      const least = 3 - bunch.length;
      for (let i = 0; i < least; i++) {
        const caption = captions[index++];
        caption.primary = false;
        if (caption) bunch.push(caption);
        // exception of last caption
        else bunch.push(emptyItem);
      }
    }
    // console.log(bunch);
    return bunch;
  }

  onChangeConfig(config) {
    // console.log(config);
    this.setState({ config: config });
  }

  render() {
    const { player } = this.props;

    // no video
    if (!player) {
      return <div className="caption-container">no video loaded</div>;
    }

    let infoMsg;
    // not sign in
    if (!this.props.isSignIn) {
      infoMsg = <InfoMsg msg={'user not sign in. you need to sign in'} />;
    }
    let errorMsg;
    if (this.state.errorMsg !== '') {
      errorMsg = <ErrorMsg msg={this.state.errorMsg} />;
    }
    let warningMsg;
    if (this.state.errorMsg !== '') {
      warningMsg = <WarningMsg msg={this.state.warningMsg} />;
    }

    // caption language selector
    let selector;
    // if (false) {
    if (!this.state.languageList.length > 0) {
      selector = <CaptionSelector msg={'loading caption list'} />;
    } else {
      selector = (
        <CaptionSelector
          onChangeSelect={this.onChangeSelect}
          languageList={this.state.languageList}
        />
      );
    }

    // caption
    let caption;
    if (this.state.caption) {
      const bunch = this.getBunchOfCaption();
      caption = (
        <div className="" ref={this.container}>
          <CaptionItem bunch={bunch} config={this.state.config} />
        </div>
      );
    }

    return (
      <div className="caption-container">
        <div className="one-half column">{selector}</div>
        <div className="one-half column u-pull-left">
          <CaptionConfig onChange={this.onChangeConfig} />
        </div>
        <div className="twelve columns">
          <div className="row u-max-full-width">{caption}</div>
        </div>
        {errorMsg}
        {warningMsg}
        {infoMsg}
      </div>
    );
  }
}

export default CaptionContainer;
