import React, { useEffect, useRef } from 'react';

const AudioPlayer = ({ src, onPlay }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    const audioElement = audioRef.current;

    const handlePlay = () => {
      if (onPlay) {
        onPlay(audioElement);
      }
    };

    audioElement.addEventListener('play', handlePlay);

    return () => {
      audioElement.removeEventListener('play', handlePlay);
    };
  }, [onPlay]);

  return <audio className="w-full" ref={audioRef} src={src} controls />;
};

export default AudioPlayer;

// SoundCloud-style bars
// import React, { useEffect, useRef } from 'react';
// import WaveSurfer from 'wavesurfer.js';

// const AudioPlayer = ({ src }) => {
//   const waveformRef = useRef(null);
//   const wavesurferRef = useRef(null);

//   useEffect(() => {
//     if (waveformRef.current && !wavesurferRef.current) {
//       wavesurferRef.current = WaveSurfer.create({
//         container: waveformRef.current,
//         waveColor: 'white',
//         progressColor: 'gray',
//         barWidth: 8,
//         barGap: 4,
//         barRadius: 8,
//         responsive: true,
//         normalize: true, // Optional: Normalize audio to improve volume consistency
//         backend: 'WebAudio', // Optional: Use WebAudio backend for better performance
//         plugins: [WaveSurfer.cursor.create()], // Optional: Add plugins like cursor
//       });

//       wavesurferRef.current.load(src); // Load audio from the src prop

//       // Event listener for when user interacts with the waveform
//       wavesurferRef.current.once('interaction', () => {
//         wavesurferRef.current.play(); // Play audio once user interacts with waveform
//       });
//     }

//     return () => {
//       if (wavesurferRef.current) {
//         wavesurferRef.current.destroy(); // Cleanup Wavesurfer instance on unmount
//       }
//     };
//   }, [src]);

//   return <div ref={waveformRef} style={{ width: '100%', height: '128px' }} />;
// };

// export default AudioPlayer;

// import React, { useRef, useEffect, useState } from "react";
// import WaveSurfer from "wavesurfer.js";

// const formWaveSurferOptions = (ref) => ({
//   container: ref,
//   waveColor: 'white',
//   progressColor: 'gray',
//   cursorColor: 'transparent',
//   responsive: true,
//   height: 80,
//   normalize: true,
//   backend: 'WebAudio',
//   barWidth: 8,
//   barGap: 4,
//   barRadius: 8,
// });

// const AudioPlayer = ({ src, onPlay }) => {
//   const waveformRef = useRef(null);
//   const wavesurfer = useRef(null);
//   const [playing, setPlaying] = useState(false);
//   const [volume, setVolume] = useState(0.5);
//   const [muted, setMuted] = useState(false);

//   useEffect(() => {
//     const options = formWaveSurferOptions(waveformRef.current);
//     wavesurfer.current = WaveSurfer.create(options);

//     wavesurfer.current.on('error', (err) => {
//       console.error('WaveSurfer error:', err);
//       // Handle the error here, e.g., show a message to the user
//     });

//     wavesurfer.current.load(src)
//       .then(() => {
//         setVolume(wavesurfer.current.getVolume());
//       })
//       .catch(error => {
//         console.error('Error loading audio:', error);
//         // Handle loading error here, e.g., retry or show an error message
//       });

//     wavesurfer.current.on('ready', () => {
//       // Optionally, handle when wavesurfer is ready
//     });

//     return () => {
//       if (wavesurfer.current) {
//         wavesurfer.current.un('audioprocess');
//         wavesurfer.current.un('ready');
//         wavesurfer.current.destroy();
//       }
//     };
//   }, [src]);

//   const handlePlayPause = () => {
//     setPlaying(!playing);
//     if (playing) {
//       wavesurfer.current.pause();
//     } else {
//       wavesurfer.current.play();
//     }
//     onPlay(wavesurfer.current); // Notify parent component about play state
//   };

//   const handleVolumeChange = (newVolume) => {
//     setVolume(newVolume);
//     wavesurfer.current.setVolume(newVolume);
//     setMuted(newVolume === 0);
//   };

//   const handleMute = () => {
//     const newMuted = !muted;
//     setMuted(newMuted);
//     wavesurfer.current.setVolume(newMuted ? 0 : volume);
//   };

//   const handleVolumeUp = () => {
//     handleVolumeChange(Math.min(volume + 0.1, 1));
//   };

//   const handleVolumeDown = () => {
//     handleVolumeChange(Math.max(volume - 0.1, 0));
//   };

//   return (
//     <div id="waveform" ref={waveformRef} className="w-full">
//       <div className="controls">
//         <button onClick={handlePlayPause}>
//           {playing ? 'Pause' : 'Play'}
//         </button>
//         <button onClick={handleMute}>
//           {muted ? 'Unmute' : 'Mute'}
//         </button>
//         <input
//           type="range"
//           id="volume"
//           name="volume"
//           min={0}
//           max={1}
//           step={0.05}
//           value={muted ? 0 : volume}
//           onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
//         />
//         <button onClick={handleVolumeDown}>-</button>
//         <button onClick={handleVolumeUp}>+</button>
//       </div>
//     </div>
//   );
// };

// export default AudioPlayer;
