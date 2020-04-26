import React, { Component, Fragment } from 'react';
// import * as Subtitle from 'subtitle';
import {
  parse,
  // stringify,
  // stringifyVtt,
  // resync,
  // toMS,
  // toSrtTime,
  // toVttTime,
} from 'subtitle';
import CaptionItem from './CaptionItem';

import srtFile from './eng.srt';
// import { faBoxTissue } from '@fortawesome/free-solid-svg-icons';

class CaptionContainer extends Component {
  constructor() {
    super();
    this.state = {
      caption: null,
      time: 0,
      captionList: null,
    };

    // fetch(srtFile)
    //   .then((rep) => rep.text())
    //   .then((data) => {
    //     const srt = parse(data);
    //     // whatever, it is works...
    //     this.setState({ caption: srt });
    //   })
    //   .catch((err) => console.log(err));

    this.container = React.createRef();

    this.getCaptionList = this.getCaptionList.bind(this);
  }

  componentDidMount() {
    // console.log(this.container.current);
    this.props.handleCaption(this.getCaptionList);
  }

  componentDidUpdate() {
    // const video = this.props.video;
    // if (video) this.getCaptionList(video.id);
  }

  setScrollPosition(y) {
    // this.container.scrollTo(0, y);
  }

  // get caption language list
  getCaptionList(videoId) {
    const gapi = window.gapi;

    const captionMap = new Map();
    for (let i = 0; i < 100; i++) {
      captionMap.set(i, i);
    }

    this.setState({ captionList: captionMap });
    console.log('caption map loaded');

    return;
    gapi.client.youtube.captions
      .list({
        part: 'snippet',
        videoId: videoId,
      })
      .then((rep) => {
        // load caption list
        const items = rep.result.items;
        const captionMap = new Map();
        items.forEach((item) => captionMap.set(item.id, item.snippet.language));
        console.log(captionMap);
        // make select tag
        const select = (
          <div>
            <select>
              {captionMap.forEach((caption) => {
                return <option value={caption.id}>{caption.value}</option>;
              })}
            </select>
          </div>
        );
        console.log(select);
        return select;
      })
      .then((dom) => (this.select = dom))
      .catch((err) => console.log(err));
  }

  render() {
    const video = this.props.video;

    // no video
    if (!video) {
      return <div>no video loaded</div>;
    }
    // not sign in
    if (!this.props.isSignIn) {
      return <div>user not sign in. you need sign in</div>;
    }

    console.log('caption ', this.state);

    if (!this.state.captionList) {
      return <div>loading caption list</div>;
    } else {
      // make caption selector
      const select = (
        <div>
          <select>
            {this.state.captionList.forEach((caption) => (
              <option value={caption.id}>{caption.value}</option>
            ))}
          </select>
        </div>
      );

      // caption not loaded
      if (!this.state.caption) {
        return <div>caption list{select}</div>;
      }
      // caption loaded
      else {
        return (
          <div>
            {this.select}
            <div className="caption-container" ref={this.container}>
              {this.state.caption.map((item, i) => {
                return <CaptionItem text={item.text} key={i} />;
              })}
            </div>
          </div>
        );
      }
    }
  }
}

export default CaptionContainer;
