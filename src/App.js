import React from 'react';
import './App.css';
import '../node_modules/skeleton-css/css/skeleton.css';
import '../node_modules/skeleton-css/css/normalize.css';

import Title from './components/Title';
import VideoContainer from './components/video/VideoContainer';
import Footer from './components/Footer';

function App() {
  const title = 'Youtube-caption-customizer';

  return (
    <div className="app-container">
      <Title title={title} />
      <VideoContainer />
      <Footer />
    </div>
  );
}

export default App;
