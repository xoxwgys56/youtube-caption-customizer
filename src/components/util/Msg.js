import React from 'react';

/**
 * Error message
 *
 * presentation component
 */
export const ErrorMsg = (props) => {
  const { msg } = props;
  // throw msg;
  return (
    <div className="row">
      <div className="twelve columns error-msg">
        <h5>ERROR: {msg}</h5>
        <p>more detail. check the development tab.</p>
      </div>
    </div>
  );
};

export const WarningMsg = (props) => {
  const { msg } = props;
  // console.log('warning message : ', msg);
  return (
    <div className="row">
      <div className="twelve columns warning-msg">
        <h5>WARNING: {msg}</h5>
        <p>more detail. check the development tab.</p>
      </div>
    </div>
  );
};

export const InfoMsg = (props) => {
  const { msg } = props;
  // console.log('info message : ', msg);
  return (
    <div className="row">
      <div className="twelve columns warning-msg">
        <h5>INFO: {msg}</h5>
      </div>
    </div>
  );
};
