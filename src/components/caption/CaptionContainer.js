import React, { Component } from 'react';
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
    };

    fetch(srtFile)
      .then((rep) => rep.text())
      .then((data) => {
        const srt = parse(data);
        // whatever, it is works...
        this.setState({ caption: srt });
      })
      .catch((err) => console.log(err));

    this.container = React.createRef();
  }

  setScrollPosition(y) {
    // this.container.scrollTo(0, y);
  }

  componentDidMount() {
    console.log(this.container.current);
  }

  render() {
    const video = this.props.video;
    // no video
    if (!video) {
      return <div>no video loaded</div>;
    }
    // not sign in
    if (!this.props.user) {
      return <div>user not sign in. you need sign in</div>;
    }

    const caption = this.state.caption;

    if (!caption) {
      return <div>no caption</div>;
    } else {
      const container = (
        <div className="caption-container" ref={this.container}>
          {caption.map((item, i) => {
            return <CaptionItem text={item.text} key={i} />;
          })}
        </div>
      );
      this.container = container;

      return container;
    }
  }
}

export default CaptionContainer;
