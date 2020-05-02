import React, { Component } from 'react';

class CaptionItem extends Component {
  constructor(props) {
    super(props);
    this.setFontConfig = this.setFontConfig.bind(this);
    this.getPrimaryStyle = this.getPrimaryStyle.bind(this);
    this.getSideStyle = this.getSideStyle.bind(this);
  }

  setFontConfig() {
    const config = this.props.config;

    if (!config) return;
    // if there is no caption, return
    if (!this.baseCaption.current) return;
    // set font size
    const fontSize = config.fontSize;
    const baseSize = fontSize + config.fontUnit;
    const otherSize = fontSize * 0.5 + config.fontUnit;
    // set caption item configuration
    const baseCaptionStyle = this.baseCaption.current.style;

    let afterCaptionStyle = null,
      prevCaptionStyle = null;
    if (this.afterCaption.current)
      afterCaptionStyle = this.afterCaption.current.style;
    if (this.prevCaption.current)
      prevCaptionStyle = this.prevCaption.current.style;
    // base main caption
    baseCaptionStyle.fontSize = baseSize;
    baseCaptionStyle.color = config.color;
    baseCaptionStyle.fontWeight = config.weight;
    baseCaptionStyle.fontStyle = config.style;
    // other side caption
    if (afterCaptionStyle) {
      afterCaptionStyle.fontSize = otherSize;
      afterCaptionStyle.color = config.color;
      afterCaptionStyle.fontWeight = config.weight;
      afterCaptionStyle.fontStyle = config.style;
    }
    if (prevCaptionStyle) {
      prevCaptionStyle.fontSize = otherSize;
      prevCaptionStyle.color = config.color;
      prevCaptionStyle.fontWeight = config.weight;
      prevCaptionStyle.fontStyle = config.style;
    }
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

    this.setFontConfig();
    // console.log(bunch);
    // no caption that time
    if (!bunch) return <div>load caption...</div>;

    const captions = [];
    for (let i = 0; i < bunch.length; i++) {
      const primary = bunch.primary;
      const text = bunch[i].caption.text;

      if (primary) {
        captions.push(<Caption text={text} style={this.getPrimaryStyle} />);
      } else {
        captions.push(<Caption text={text} style={this.getSideStyle} />);
      }
    }

    return <div className="caption-item">{captions.map((item) => item)}</div>;

    // switch (bunch.length) {
    //   case 1:
    //     return (
    //       <div className="caption-item">
    //         <h5 ref={this.baseCaption}>{bunch[0].text}</h5>
    //       </div>
    //     );
    //   case 2:
    //     return (
    //       <div className="caption-item">
    //         <h5 ref={this.baseCaption}>{bunch[0].text}</h5>
    //         <h6 ref={this.afterCaption}>{bunch[1].text}</h6>
    //       </div>
    //     );
    //   case 3:
    //     return (
    //       <div className="caption-item">
    //         <h6 ref={this.prevCaption}>{bunch[0].text}</h6>
    //         <h5 ref={this.baseCaption}>{bunch[1].text}</h5>
    //         <h6 ref={this.afterCaption}>{bunch[2].text}</h6>
    //       </div>
    //     );
    //   default:
    //     return <div className="caption-item">...</div>;
    // }
  }
}

CaptionItem.propTypes = {
  // text: PropTypes.string.isRequired,
};

const Caption = (props) => {
  const { text, style } = props;

  return <p style={style}>{text}</p>;
};

export default CaptionItem;
