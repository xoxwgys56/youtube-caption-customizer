import React from 'react';
import PropTypes from 'prop-types';

const CaptionItem = (props) => {
  return <div className="caption-item">{props.text}</div>;
};

CaptionItem.propTypes = {
  text: PropTypes.string.isRequired,
};

export default CaptionItem;
