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

// import { WaveSurfer } from 'wavesurfer-react';
// import RegionsPlugin from "wavesurfer.js/dist/plugins/regions";
// import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline";
// import MyCustomPlugin from 'my-custom-plugin-path';

// const plugins = [
//    {
//       plugin: RegionsPlugin,
//       key: "regions",
//       options: { dragSelection: true }
//    },
//    {
//       plugin: TimelinePlugin,
//       key: "timeline",
//       options: {
//          container: "#timeline"
//       }
//    },
//    {
//       plugin: MyCustomPlugin,
//       key: "my-custom-plugin",
//       options: {
//          someGreatOption: 'someGreatValue'
//       },
//       creator: 'myCustomCreate'
//    }
// ];

// <WaveSurfer plugins={plugins} />