function preload() {
  soundFormats('mp3', 'ogg', 'wav');
  mySound = loadSound('assets/roland/Bass/Bass-Beanbass.wav');
}

function setup() {
  createCanvas(400, 400);
  mySound.setVolume(1);
  mySound.play();
}