import React from 'react';

const Title = (props) => {
  return (
    <div className="section">
      <div className="container">
        {/* <div className="row">night & day</div> */}
        <div className="row">
          <h4 className="app-title">{props.title}</h4>
        </div>
      </div>
    </div>
  );
};

export default Title;
