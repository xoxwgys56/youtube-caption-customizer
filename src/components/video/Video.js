import React from 'react';
import PropTypes from 'prop-types';
import Youtube from 'react-youtube';

const Video = (props) => {
  const video = props.video;

  if (!video) {
    return <NoVideo />;
  }

  const option = {
    playerVars: {
      autoplay: 0,
      controls: 0,
      // fs: 0, // do not use contols so it does not happen
      modestbranding: 1,
      rel: 0,
    },
  };

  return (
    <div className="youtube">
      <Youtube
        videoId={video.id}
        opts={option}
        onReady={props.onReady}
        onPlay={props.onPlay}
        onPause={props.onPause}
      />
    </div>
  );
};

Video.propTypes = {
  // id: PropTypes.string.isRequired,
  video: PropTypes.object,
};

const NoVideo = () => {
  return (
    <div className="no-video">
      no video, input link
      <div className="no-video"></div>
      {/* <iframe></iframe> */}
    </div>
  );
};

const LoadingVideo = () => {
  return <div className="loading-video">loading video</div>;
};

export default Video;
