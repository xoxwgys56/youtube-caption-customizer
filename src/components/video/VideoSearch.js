import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const VideoSearch = (props) => {
  const onSubmit = (e) => {
    e.preventDefault();

    const input = document.getElementById('search-input').value;
    props.handleSubmit(input);
  };

  // const link = props.link;

  // const form = <div></div>;

  // not sign in
  if (!props.signin) {
    return (
      <div className="row">
        <SearchForm onSubmit={onSubmit}>{props.children}</SearchForm>
      </div>
    );
    // sign in
  } else {
    return (
      <div>
        <SearchForm onSubmit={onSubmit}>
          <SearchButton />
        </SearchForm>
        {props.children}
      </div>
    );
  }
};

const SearchForm = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
      <div className="row">
        <div className="u-full-width ten columns">
          <input
            id="search-input"
            // className="search-input"
            placeholder="youtube link"
            type="text"
          />
        </div>
        {props.children}
      </div>
    </form>
  );
};

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
