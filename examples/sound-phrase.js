var mySound, myPhrase, myPart, sounds;
var pattern = [1,0,0,2,0,2,0,0];
var msg = 'click to play';

function preload() {
    sounds = {
      lead : loadSound('assets/roland/Synth/Synth-D10erig.wav')
    }
}

function setup() {
  createCanvas(400, 400);
  noStroke();
  fill(255);
  textAlign(CENTER);
  masterVolume(1);

  myPhrase = new p5.Phrase('bbox', makeSound, pattern);
  myPart = new p5.Part();
  myPart.addPhrase(myPhrase);
  myPart.setBPM(60);
}

function draw() {
  background(0);
  text(msg, width/2, height/2);
}

function makeSound(time, playbackRate) {
  mySound.rate(playbackRate);
  mySound.play(time);
}

function mouseClicked() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    sounds.lead.start();
    msg = 'playing pattern';
  }
}