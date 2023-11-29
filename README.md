## Simple Music Notation App

Here's a simple app that can take a user's audio input, and display the note played, in note notation (ie, A, C#), and frequency (ie, 1000 Hz).

## To run:
  1. Navigate into this directory in your terminal, and run `npm install`
  2. Run `npm run dev`
  3. Have some audio playing (either on your computer out of your speakers, or on your instrument) and click on the `Start Detection` button. (Make sure to allow access to your microphone)
  4. You can click on the `Show/hide Frequency` button to toggle if the frequency shows up under the note!


## Some other notes:
  This riffed off of this `PitchDetect` project quite a bit! https://github.com/cwilso/PitchDetect I made a fork of it and turned it into a library that I linked to this project, then I brought some of the code into my local project itself to more easily work with the stream in one place. It works using an autocorrelation algorithm, which you can find in the `autoCorrelate` function in the `PitchDetector` package that's linked to this one!

  I tested this on Chrome, Firefox, and Safari - it worked on Chrome and Firefox, but not Safari -- not sure why, maybe something with the browser-specific stream, let me know if I should look into that!

  You also have access to some other stuff besides just the note and frequency! There's if it's certain or not that the note is what's being displayed, if it's flat or sharp, how many cents off of a perfect pitch it is, etc. 
