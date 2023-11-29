import { useState, useEffect } from 'react'
import * as PitchDetector from 'pitchdetector';
import './App.css'

window.AudioContext = window.AudioContext || window.webkitAudioContext;

const App = () => {
  let audioContext = null;
  let rafID = null;
  let mediaStreamSource = null;
  let analyser = null;
  let buf = new Float32Array( 2048 );
  const [noteInfo, setNoteInfo] = useState({});
  const [showFrequency, setShowFrequency] = useState(false);

  const startPitchDetect = () => {	
      // grab an audio context
      audioContext = new AudioContext();

      // Attempt to get audio input
      navigator.mediaDevices.getUserMedia(
      {
          "audio": {
              "mandatory": {
                  "googEchoCancellation": "false",
                  "googAutoGainControl": "false",
                  "googNoiseSuppression": "false",
                  "googHighpassFilter": "false"
              },
              "optional": []
          },
      }).then((stream) => {
          // Create an AudioNode from the stream.
          mediaStreamSource = audioContext.createMediaStreamSource(stream);

        // Connect it to the destination.
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        mediaStreamSource.connect( analyser );
        updatePitch();
      }).catch((err) => {
          // always check for errors at the end.
          console.error(`${err.name}: ${err.message}`);
          alert('Stream generation failed.');
      });
  }

  const updatePitch = () => {
    let cycles = new Array;
    analyser.getFloatTimeDomainData( buf );
    var ac = PitchDetector.autoCorrelate( buf, audioContext.sampleRate );
    let certainty = '-';
    let noteDisplay = '-';
    let pitchDisplay = '-';
    let detuneDisplay = '-';
    let detuneAmount = '-';
    let detune = null;
    let note = null;
    let pitch = null;

    if (ac == -1) {
      certainty = "vague";
      noteDisplay = '-';
      pitchDisplay = '-';
      detune = '-'
      pitchDisplay = "-";
      detuneDisplay = "-";
      detuneAmount = "-";
    } else {
      certainty = "confident";
      pitch = ac;
      pitchDisplay = Math.round( pitch ) ;
      note =  PitchDetector.noteFromPitch( pitch );
      noteDisplay = PitchDetector.NOTE_STRINGS[note%12];
      detune = PitchDetector.centsOffFromPitch( pitch, note );
      if (detune == 0 ) {
        detuneDisplay = "";
        detuneAmount = "--";
      } else {
        if (detune < 0)
          detuneDisplay = "flat";
        else
          detuneDisplay = "sharp";
        detuneAmount = Math.abs( detune );
      }
    }
      setNoteInfo({...noteInfo, certainty, noteDisplay, pitchDisplay, detuneDisplay, detuneAmount, detune, note, pitch});


      if (!window.requestAnimationFrame){
      window.requestAnimationFrame = window.webkitRequestAnimationFrame;
      }

      rafID = window.requestAnimationFrame( updatePitch );
    };

  const onStartDetectionClick = () => {
      startPitchDetect();
  }
  const onToggleFrequencyClick = () => {
    setShowFrequency(!showFrequency);
  }


  return (
    <div className="piano-app">
      <h1 className="title"> 🎹 Music Listener 🎶 </h1>
      <button onClick={onStartDetectionClick}>
        Start Detection
      </button>
      <button onClick={onToggleFrequencyClick}>
        Show/Hide Frequency
      </button>
      <div className="music-info">
        <div className="note-info">
          {noteInfo && noteInfo?.noteDisplay}
        </div>
        <div className="pitch-info">
          {showFrequency && noteInfo && `${noteInfo?.pitchDisplay} Hz`} 
        </div>
      </div>
    </div>
  );
};

export default App;