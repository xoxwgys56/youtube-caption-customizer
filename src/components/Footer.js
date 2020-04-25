import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer className="footer">
      copyright 2020 dw
      <a className="icon" href="#" target="_blank">
        <FontAwesomeIcon icon={faCode} />
      </a>
    </footer>
  );
};

export default Footer;
