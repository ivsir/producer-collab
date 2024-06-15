import React, { useEffect, useRef, useState } from 'react';
// import "../style/BackgroundVisualizer.css";

const AudioPlayer = ({ src, onPlay }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audioElement = audioRef.current;

    const handlePlay = () => {
      setIsPlaying(true);
      if (onPlay) {
        onPlay(audioElement);
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audioElement.addEventListener('play', handlePlay);
    audioElement.addEventListener('pause', handlePause);

    return () => {
      audioElement.removeEventListener('play', handlePlay);
      audioElement.removeEventListener('pause', handlePause);
    };
  }, [onPlay]);

  useEffect(() => {
    if (isPlaying) {
      document.body.classList.add('glow-active');
    } else {
      document.body.classList.remove('glow-active');
    }
  }, [isPlaying]);

  return <audio className="w-full" ref={audioRef} src={src} controls />;
};

export default AudioPlayer;


// import React, { useRef, useEffect } from "react";
// import WaveSurfer from "wavesurfer.js";

// export default function AudioPlayer(src){
//   const waveformRef = useRef();

//   useEffect(() => {
//     if(waveformRef.current) {
//       const wavesurfer = WaveSurfer.create({
//         container: waveformRef.current,
//       });
//     }
//   }, [src]);
  
//   return(
//     <>
//       <div className="bg-white" ref={waveformRef}>
//       </div>
//     </>
//   )
//  }


// // AudioPlayer.js
// import React, { useRef, useEffect } from 'react';
// import WaveSurfer from 'wavesurfer.js';
// import { Waveform } from 'react-wavesurfer';

// const AudioPlayer = ({ src }) => {
//   const wavesurferRef = useRef(null);

//   useEffect(() => {
//     wavesurferRef.current = WaveSurfer.create({
//       container: '#waveform',
//       waveColor: '#4F4A85',
//       progressColor: '#383351',
//       barWidth: 2,
//       cursorWidth: 0,
//       backend: 'WebAudio', // or 'MediaElement'
//       plugins: [WaveSurfer.cursor.create({ showTime: true })],
//     });

//     wavesurferRef.current.load(src);

//     return () => {
//       wavesurferRef.current.destroy();
//     };
//   }, [src]);

//   return (
//     <div id="waveform">
//       <Waveform
//         waveSurfer={wavesurferRef.current}
//         style={{ width: '100%', height: '100px' }}
//       />
//     </div>
//   );
// };

// export default AudioPlayer;

