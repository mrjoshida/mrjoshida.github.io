//
// This could be interesting using Sprite Lab behaviors, eg
// <sprite> starts <rotating> to <bass>
//

var pieces, radius, fft, mapMouseX, mapMouseY, toggleBtn, audio, uploadBtn, uploadedAudio, uploadAnim;
var carrier; // this is the oscillator we will hear
var modulator; // this oscillator will modulate the amplitude of the carrier
var fft; // we'll visualize the waveform


var bgColor = "white";

function preload() {
	audio = loadSound("assets/tracks/L.O.R.D.mp3");
}


function setup() {

	createCanvas(800, 400);

	fft = new p5.FFT();


    peakDetect = new p5.PeakDetect();
      audio.amp(0);
      // carrier's amp is 0 by default, giving our modulator total control

      audio.loop();

      modulator = new p5.Oscillator('triangle');
      modulator.disconnect();  // disconnect the modulator from master output
      modulator.freq(5);
      modulator.amp(1);
      modulator.start();

      // Modulate the carrier's amplitude with the modulator
      // Optionally, we can scale the signal.
      audio.amp(modulator.scale(-1,1,1,-1));


    colorMode(HSB, 255);

	bassSprite = createSprite(200, 200);
	bassSprite.addAnimation('normal', 'assets/ghost_spin0001.png', 'assets/ghost_spin0003.png');

	midSprite = createSprite(400, 200);
	midSprite.addAnimation('normal', 'assets/asterisk_normal0001.png', 'assets/asterisk_normal0003.png');

	trebleSprite = createSprite(600, 200);
	trebleSprite.addAnimation('normal', 'assets/small_platform0001.png', 'assets/small_platform0003.png');
}

function draw() {


	background(bgColor);

	noStroke();

	  var modFreq = map(mouseY, 0, height, 4, 0);
  modulator.freq(modFreq);

  var modAmp = map(mouseX, 0, width, 0, 1);
  modulator.amp(modAmp, 0.01); // fade time of 0.1 for smooth fading

	var spectrum = fft.analyze();

    peakDetect.update(fft);

      if ( peakDetect.isDetected ) {
        bgColor = color(random(255), random(255), random(255));
      }


    for (var i = 0; i < spectrum.length; i++) {
        var x = map(i, 0, spectrum.length, 0, width);
        var h = -height + map(spectrum[i], 0, 255, height, 0);
        fill(spectrum[i], 255, 255, 127)
        rect(x, height, width/spectrum.length, h);
    }

	var bass = fft.getEnergy("bass");
	var treble = fft.getEnergy("treble");
	var mid = fft.getEnergy("mid");

	var posMid = map(mid, 0, 255, 200, 50);
	var scaleMid = map(mid, 0, 255, .25, 2);
	var sidesMid = map(mid, 0, 255, 3, 12);
	var rotationMid = map(mid, 0, 255, -180, 180);

	var posTreble = map(treble, 0, 255, 200, 50);
	var scaleTreble = map(treble, 0, 255, .25, 2);
	var sidesTreble = map(treble, 0, 5, 20);
	var rotationTreble = map(treble, 0, 255, -180, 180);

	var posBass = map(bass, 0, 255, 200, 50);
	var scaleBass = map(bass, 0, 255, .25, 2);
	var sidesBass = map(bass, 0, 255, 3, 12);
	var rotationBass = map(bass, 0, 255, -180, 180);

	bassSprite.scale = scaleBass;
	midSprite.rotation = rotationMid;
	trebleSprite.position.y = posTreble;

	drawSprites();
}

function polygon(x, y, radius, npoints) {
  var angle = TWO_PI / npoints;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius;
    var sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function toggleAudio() {
	if (audio.isPlaying()) {
		audio.pause();
	} else {
		audio.play();
	}
}