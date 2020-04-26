import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';

class VideoSearch extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit = (e) => {
    e.preventDefault();
    // this input tag is not included this component, so we need find it.
    const input = document.getElementById('search-input').value;
    this.props.handleSubmit(input);
  };

  render() {
    // not sign in
    if (!this.props.isSignin) {
      return (
        <div className="row">
          <SearchForm onSubmit={this.onSubmit}>
            {this.props.children}
          </SearchForm>
        </div>
      );
      // sign in
    } else {
      return (
        <div>
          <SearchForm onSubmit={this.onSubmit}>
            <SearchButton />
          </SearchForm>
          {this.props.children}
        </div>
      );
    }
  }
}

VideoSearch.propTypes = {
  isSignin: PropTypes.bool.isRequired,
};

class SearchForm extends Component {
  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
  }

  componentDidMount() {
    // if cookie link exist, insert value
    if (Cookies.get('link')) {
      this.inputRef.current.value = Cookies.get('link');
    }
  }

  render() {
    return (
      <form onSubmit={this.props.onSubmit}>
        <div className="row">
          <div className="u-full-width ten columns">
            <input
              id="search-input"
              // className="search-input"
              placeholder="youtube link"
              type="text"
              ref={this.inputRef}
            />
          </div>
          {this.props.children}
        </div>
      </form>
    );
  }
}

const SearchButton = () => {
  return (
    <div className="two columns">
      <input
        className="search-submit-text button-primary"
        type="submit"
        value="search"
      />
      <button className="search-submit-icon" type="submit">
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </div>
  );
};

export default VideoSearch;
