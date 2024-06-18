import React from 'react';

function AudioPlayer({ src }) {
  return (
    <div className="audio-player">
      <audio controls>
        <source src={src}/>
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default AudioPlayer;
