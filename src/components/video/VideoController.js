import React, { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

import Footer from '../Footer';

const VideoController = (props) => {
  let playIcon;
  if (props.play) playIcon = <FontAwesomeIcon icon={faPlay} />;
  else playIcon = <FontAwesomeIcon icon={faPause} />;

  const playTime = '00:00';

  return (
    <Fragment>
      <div className="video-controller-container">
        <div className="video-play-btn">{playIcon}</div>
        <div className="video-controller">
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value="0"
            onChange={props.onControllerChange}
          />
        </div>
        <div className="video-timestamp">{playTime}</div>
        {/* <div className="section">
        <div className="container">
          <div className="row">
            <div className="column one">{playIcon}</div>
            <div className="column ten">
              <input type="range" min="0" max="100" step="0.1" value="0" />
            </div>
            <div className="column one">00:00</div>
          </div>
        </div>
      </div> */}

        {/* <Footer /> */}
      </div>
    </Fragment>
  );
};

export default VideoController;
