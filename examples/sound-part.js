
var box, drum, myPart, sounds;
var boxPat = [1,0,0,2,0,2,0,0];
var drumPat = [0,1,1,0,2,0,1,0];
var msg = 'click to play';

function preload() {
    sounds = {
        lead : loadSound('assets/roland/Synth/Synth-D10erig.wav'),
        bass: loadSound('assets/roland/Bass/bass-StrandjutterBas 1.wav')
    }
}

function setup() {
  createCanvas(400, 400);
  noStroke();
  fill(255);
  textAlign(CENTER);
  masterVolume(0.1);

  var boxPhrase = new p5.Phrase('box', playBox, boxPat);
  var drumPhrase = new p5.Phrase('drum', playDrum, drumPat);
  myPart = new p5.Part();
  myPart.addPhrase(boxPhrase);
  myPart.addPhrase(drumPhrase);
  myPart.setBPM(60);
  masterVolume(1);
}

function draw() {
  background(0);
  text(msg, width/2, height/2);
}

function playBox(time, playbackRate) {
  sounds.lead.rate(playbackRate);
  sounds.lead.play(time);
}

function playDrum(time, playbackRate) {
  sounds.bass.rate(playbackRate);
  sounds.bass.play(time);
}

function mouseClicked() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    myPart.start();
    msg = 'playing part';
  }
}