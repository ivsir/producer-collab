// import React, { useEffect, useRef } from 'react';

// const AudioPlayer = ({ src, onPlay }) => {
//   const audioRef = useRef(null);

//   useEffect(() => {
//     const audioElement = audioRef.current;

//     const handlePlay = () => {
//       if (onPlay) {
//         onPlay(audioElement);
//       }
//     };

//     audioElement.addEventListener('play', handlePlay);

//     return () => {
//       audioElement.removeEventListener('play', handlePlay);
//     };
//   }, [onPlay]);

//   return <audio className="w-full" ref={audioRef} src={src} controls />;
// };

// export default AudioPlayer;

//Wavesurfer Audio Player
import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

function WaveSurferAudio ({ audioUrl, projectId }) {
  const wavesurferRef = useRef(null);

  useEffect(() => {
    if (wavesurferRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: wavesurferRef.current,
        waveColor: 'gray',
        progressColor: 'white',
        cursorColor: 'transparent',
        height: 100,
        barWidth: 6,
        barGap: 4,
        barRadius: 8,
        backend: 'WebAudio',
      });

      wavesurfer.load(audioUrl);
      wavesurfer.on('ready', () => {
        console.log('WaveSurfer is ready');
      });

      return () => {
        wavesurfer.destroy();
      };
    }
  }, [audioUrl]);

  return <div ref={wavesurferRef}></div>;
}

export default WaveSurferAudio ;
