import React, { Component } from 'react';

export class CaptionSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      language: '',
    };

    this.onChangeSelect = this.onChangeSelect.bind(this);
  }

  onChangeSelect(e) {
    e.preventDefault();
    const id = e.target.value;
    const language = e.target.options[e.target.selectedIndex].innerText;
    this.props.onChangeSelect(id);
    this.setState({ language: language });
  }

  render() {
    const { languageList, msg } = this.props;

    if (msg) {
      return <div className="one column">{msg}</div>;
    }

    // do not use this.
    // let language;
    // if (this.state.language)
    //   language = (
    //     <span className="caption-language">{this.state.language}</span>
    //   );

    return (
      <div className="u-full-width">
        <select onChange={this.onChangeSelect}>
          <option value="">select language</option>
          {languageList.map((caption, i) => (
            <option value={caption.id} key={i} label={caption.language}>
              {caption.language}
            </option>
          ))}
        </select>
        {/* <span className="">{language}</span> */}
      </div>
    );
  }
}

export default CaptionSelector;
