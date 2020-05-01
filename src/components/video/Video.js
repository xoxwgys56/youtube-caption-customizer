import React from 'react';
import PropTypes from 'prop-types';
import Youtube from 'react-youtube';

const Video = (props) => {
  const { video, onReady, onPlay, onPause, onEnd } = props;

  if (!video) {
    return <NoVideo />;
  }

  const option = {
    playerVars: {
      autoplay: 0,
      controls: 1,
      fs: 0,
      modestbranding: 1,
      rel: 0,
    },
  };

  return (
    <div className="youtube">
      <Youtube
        videoId={video.id}
        opts={option}
        onReady={onReady}
        onPlay={onPlay}
        onPause={onPause}
        onEnd={onEnd}
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

// const LoadingVideo = () => {
//   return <div className="loading-video">loading video</div>;
// };

export default Video;
