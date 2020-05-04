import React, { Component } from 'react';
import PropTypes from 'prop-types';

/** caption itme container
 *
 * presentation component.
 * get style data from CaptionConfig inside of  CaptionContainer.
 *
 */
class CaptionItem extends Component {
  constructor(props) {
    super(props);
    this.getPrimaryStyle = this.getPrimaryStyle.bind(this);
    this.getSideStyle = this.getSideStyle.bind(this);
  }

  getPrimaryStyle() {
    const {
      fontSize,
      color,
      fontWeight,
      fontStyle,
      fontUnit,
    } = this.props.config;
    const style = {
      fontSize: fontSize + fontUnit,
      color: color,
      fontWeight: fontWeight,
      fontStyle: fontStyle,
    };
    return style;
  }

  getSideStyle() {
    const {
      fontSize,
      color,
      fontWeight,
      fontStyle,
      fontUnit,
    } = this.props.config;
    const style = {
      fontSize: fontSize * 0.5 + fontUnit,
      color: color,
      fontWeight: fontWeight,
      fontStyle: fontStyle,
    };
    return style;
  }

  render() {
    const { bunch } = this.props;
    /** bunch {
     *    start, end, text, primary
     * }
     */

    // no caption that time
    if (!bunch) return <div>load caption...</div>;

    const captions = [];
    for (let i = 0; i < bunch.length; i++) {
      console.log(bunch, bunch.length, i);
      const primary = bunch.primary;
      const text = bunch[i].text;

      if (primary) {
        captions.push(<Caption text={text} style={this.getPrimaryStyle} />);
      } else {
        captions.push(<Caption text={text} style={this.getSideStyle} />);
      }
    }

    return <div className="caption-item">{captions.map((item) => item)}</div>;
  }
}

CaptionItem.propTypes = {
  bunch: PropTypes.object.isRequired,
};

/** each caption item
 *
 * get props from CaptionItem
 *
 * presentation component
 */
const Caption = (props) => {
  const { text, style } = props;
  return <p style={style}>{text}</p>;
};

export default CaptionItem;
