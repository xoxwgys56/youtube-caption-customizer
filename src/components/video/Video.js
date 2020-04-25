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
    <div className="youtube">
      no video
      <iframe></iframe>
    </div>
  );
};

const LoadingVideo = () => {
  return (
    <div className="youtube">
      loading video
      <iframe></iframe>
    </div>
  );
};

export default Video;
