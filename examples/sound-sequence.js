

/**
 *  Create a sequence using a Part with callbacks that play back soundfiles.
 *  The callback includes parameters (the value at that position in the Phrase array)
 *  as well as time, which should be used to schedule playback with precision.
 *
 */

var click, beatbox, fft, peakDetect;
var clickPhrase = [1, 0, 0, 0];
var bboxPhrase = [0, 0, 1, 0, 0, 0, 1, 1];
var ellipseWidth = 10;


var part; // a part we will loop

function preload() {
  soundFormats('mp3', 'ogg');
  click = loadSound('assets/roland/Synth/Synth-D10erig.wav');
  beatbox = loadSound('assets/roland/Bass/bass-StrandjutterBas 1.wav');

}

function setup() {
  createCanvas(400, 400);

  fft = new p5.FFT();
  peakDetect = new p5.PeakDetect();

  // create a part with 8 spaces, where each space represents 1/16th note (default)
  part = new p5.Part(8, 1/16);

  // add phrases, with a name, a callback, and
  // an array of values that will be passed to the callback if > 0
  part.addPhrase('kick', playKick, clickPhrase);
  part.addPhrase('snare', playSnare, bboxPhrase);

  // set tempo (Beats Per Minute) of the part and tell it to loop
  part.setBPM(80);
  part.loop();
}

function playKick(time, params) {
  click.rate(params);
  click.play(time);
}

function playSnare(time, params) {
  beatbox.rate(params);
  beatbox.play(time);
}

// draw a ball mapped to current note height
function draw() {
  background(0);

  fft.analyze();
  peakDetect.update(fft);

  if ( peakDetect.isDetected ) {
    ellipseWidth = 50;
  } else {
    ellipseWidth *= 0.95;
  }

  ellipse(width/2, height/2, ellipseWidth, ellipseWidth);
}

// UI
var hDiv = 2;
var wDiv = 16;