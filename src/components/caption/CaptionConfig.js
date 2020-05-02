import React, { Component } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCogs,
  faTimes,
  faAngleRight,
  faAngleLeft,
} from '@fortawesome/free-solid-svg-icons';
import { SliderPicker } from 'react-color';

export default class CaptionConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: '#000',
      fontSize: 2,
      weight: 400,
      style: 'none',
      fontUnit: 'em',
      maxFontSize: 3,
      checkSideCaption: true,
      sync: 0,
    };

    this.onClickPopup = this.onClickPopup.bind(this);
    this.onClickBackgroundOff = this.onClickBackgroundOff.bind(this);
    this.onClickApply = this.onClickApply.bind(this);
    this.handleChangeComplete = this.handleChangeComplete.bind(this);
    this.onChangeSlider = this.onChangeSlider.bind(this);
    this.onChangeStyle = this.onChangeStyle.bind(this);
    this.onChangeWeight = this.onChangeWeight.bind(this);
    this.onChangeCheckbox = this.onChangeCheckbox.bind(this);
    this.popupBackground = React.createRef();
    this.popupContent = React.createRef();
    this.testRef = React.createRef();
  }

  componentDidMount() {
    this.props.onChange(this.state);
  }

  onClickPopup(e) {
    // const root = document.getElementById('root').classList.add('root-blur');
    this.popupBackground.current.classList.add('caption-visible');
    this.popupContent.current.classList.add('caption-visible');
  }

  // when user click background
  onClickBackgroundOff(e) {
    this.popupBackground.current.classList.remove('caption-visible');
    this.popupContent.current.classList.remove('caption-visible');
  }

  onClickApply(e) {
    this.onClickBackgroundOff(e);

    // apply configuration
    this.props.onChange(this.state);
  }

  handleChangeComplete(e) {
    const hex = e.hex;
    this.setState({ color: hex });
    const testRefStyle = this.testRef.current.style;
    testRefStyle.color = hex;
    // if change it once
    testRefStyle.textTransform = 'uppercase';
    testRefStyle.FontWeight = '800';
  }

  onChangeSlider(e) {
    const size = this.state.maxFontSize * (e.target.value / 10);
    const unit = 'em';
    this.setState({ fontSize: size });
    this.setState({ fontUnit: unit });

    this.testRef.current.style.fontSize = size + unit;
  }

  onChangeWeight(e) {
    const weight = e.target.value;
    this.setState({ weight: weight });
  }

  onChangeStyle(e) {
    const style = e.target.value;
    this.setState({ style: style });
  }

  onChangeCheckbox(e) {
    const value = e.target.checked;
    this.setState({ checkSideCaption: value });
  }

  onClickSync(value) {
    const curValue = this.state.sync;
    this.setState({ sync: curValue + value });
  }

  render() {
    const weight = [100, 200, 300, 400, 500, 600, 700, 800, 900];

    return (
      <div className="u-full-width caption-config">
        {/* button */}
        <button className="u-pull-right" onClick={this.onClickPopup}>
          <FontAwesomeIcon icon={faCogs} />
        </button>
        {/* after button clicked */}
        {/* background cover */}
        <div
          ref={this.popupBackground}
          className="caption-config-popup caption-invisible"
          onClick={this.onClickBackgroundOff}
        ></div>
        {/* popup */}
        <div
          ref={this.popupContent}
          className="caption-config-popup-content caption-invisible"
        >
          {/* title */}
          <div className="caption-config-popup-title row u-full-width">
            configuration
          </div>
          {/* exit button */}
          <div className=" u-pull-right">
            <span
              onClick={this.onClickBackgroundOff}
              className="caption-config-popup-exit"
            >
              <FontAwesomeIcon icon={faTimes} />
            </span>
          </div>
          {/* font size row */}
          <div className="row caption-config-popup-row">
            <div className="four columns">size</div>
            <div className="eight columns">
              <input
                className="u-full-width caption-config-popup-slider"
                type="range"
                min="1"
                max="10"
                onChange={this.onChangeSlider}
              />
            </div>
          </div>
          {/* color select row */}
          <div className="row caption-config-popup-row">
            <div className="four columns">color</div>
            <div className="eight columns">
              <SliderPicker
                color={this.state.color}
                onChangeComplete={this.handleChangeComplete}
              />
            </div>
          </div>
          {/* font weight and italic style row */}
          <div className="row caption-config-popup-row">
            <div className="four columns">weight</div>
            <div className="four columns">
              <select className="u-full-width" onChange={this.onChangeWeight}>
                {weight.map((item, i) => (
                  <option value={item} key={i}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="four columns">
              <select onChange={this.onChangeStyle}>
                <option value="normal">normal</option>
                <option value="italic">italic</option>
                {/* <option value="oblique">oblique</option> */}
              </select>
            </div>
          </div>
          {/* side caption */}
          <div className="row caption-config-popup-row">
            <div className="four columns">side caption</div>
            <div className="eight columns">
              <input
                type="checkbox"
                onChange={this.onChangeCheckbox}
                checked={this.state.checkSideCaption}
              />
            </div>
          </div>
          {/* sync controll */}
          <div className="row caption-config-popup-row">
            <div className="four columns">sync</div>
            <div className="eight columns">
              <div className="row u-full-width">
                <span
                  className="four columns caption-config-sync"
                  onClick={() => this.onClickSync(-1)}
                >
                  <FontAwesomeIcon icon={faAngleLeft} />
                </span>
                <span className="four columns ">{this.state.sync}</span>
                <span
                  className="four columns caption-config-sync"
                  onClick={() => this.onClickSync(1)}
                >
                  <FontAwesomeIcon icon={faAngleRight} />
                </span>
              </div>
            </div>
          </div>
          {/* config preview */}
          <div
            className="row u-full-width caption-config-result"
            ref={this.testRef}
          >
            test by test
          </div>

          {/* apply row */}
          <div
            className="row u-full-width caption-config-apply"
            onClick={this.onClickApply}
            ref={this.sizeLabel}
          >
            apply
          </div>
        </div>
      </div>
    );
  }
}
