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
    return {
      fontSize: fontSize + fontUnit,
      color: color,
      fontWeight: fontWeight,
      fontStyle: fontStyle,
    };
  }

  getSideStyle() {
    const {
      fontSize,
      color,
      fontWeight,
      fontStyle,
      fontUnit,
    } = this.props.config;
    return {
      fontSize: fontSize * 0.5 + fontUnit,
      color: color,
      fontWeight: fontWeight,
      fontStyle: fontStyle,
    };
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
      const primary = bunch[i].primary;
      const text = bunch[i].text;

      if (primary) {
        const style = this.getPrimaryStyle();
        captions.push(
          <Caption key={captions.length} text={text} style={style} />
        );
      } else {
        const style = this.getSideStyle();
        captions.push(
          <Caption key={captions.length} text={text} style={style} />
        );
      }
    }

    return (
      <div className="caption-item-container">
        {captions.map((item) => item)}
      </div>
    );
  }
}

CaptionItem.propTypes = {
  bunch: PropTypes.array.isRequired,
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
