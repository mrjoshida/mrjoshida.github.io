//
// This could be interesting using Sprite Lab behaviors, eg
// <sprite> starts <rotating> to <bass>
//

var pieces, radius, fft, mapMouseX, mapMouseY, toggleBtn, audio, uploadBtn, uploadedAudio, uploadAnim;
var src_length; // hold sound file duration
var peaks;
var detectors = []; // array of beat detectors
var bg_color = "white";
var bass_attraction = {x: 200, y: 200};


function preload() {
	audio = loadSound("assets/tracks/L.O.R.D.mp3");
}


function setup() {
	createCanvas(800, 400);

	src_length = audio.duration();

	peaks = audio.getPeaks();

	fft = new p5.FFT();
    detectors.push( new p5.PeakDetect(40, 120, 0.8, 20) );

    // lowMid band : 140Hz-400Hz
    detectors.push( new p5.PeakDetect(140, 400, 0.7, 20) );

    // mid band : 400Hz-2.6kHz
    detectors.push( new p5.PeakDetect(400, 2600, 0.4, 20) );

    // high band : 2.7kHz-4kHz
    detectors.push( new p5.PeakDetect(2700, 4000, 0.5, 20) );

    // tell the detectors to call gotPeak function when they detect a peak
    for (var i = 0; i < detectors.length; i++) {
        detectors[i].onPeak( gotPeak, i );
    }

	audio.loop();

    colorMode(HSB, 255);

	bassSprite = createSprite(200, 200);
	bassSprite.addAnimation('normal', 'assets/ghost_standing0001.png', 'assets/ghost_standing0002.png', 'assets/ghost_standing0004.png', 'assets/ghost_standing0004.png', 'assets/ghost_standing0005.png', 'assets/ghost_standing0006.png', 'assets/ghost_standing0007.png');
	bassSprite.maxSpeed = 1;

	midSprite = createSprite(400, 200);
	midSprite.addAnimation('normal', 'assets/asterisk_normal0001.png', 'assets/asterisk_normal0003.png');
    midSprite.addAnimation('explode', 'assets/asterisk_explode0001.png', 'assets/asterisk_explode0011.png');
    midSprite.addAnimation('glitch', 'assets/asterisk.png', 'assets/triangle.png', 'assets/square.png', 'assets/cloud.png', 'assets/star.png', 'assets/mess.png', 'assets/monster.png');
    midSprite.addAnimation('sleep', 'assets/asterisk_stretching0001.png', 'assets/asterisk_stretching0008.png');
    midSprite.addAnimation('circle','assets/asterisk_circle0000.png', 'assets/asterisk_circle0008.png');
    midSprite.animationLabels = ['normal', 'explode', 'glitch', 'sleep', 'circle'];

	trebleSprite = createSprite(600, 200);
	trebleSprite.addAnimation('normal', 'assets/small_platform0001.png', 'assets/small_platform0003.png');

}

function draw() {


	background(bg_color);


	noStroke();

	var spectrum = fft.analyze();

    for (var i = 0; i < detectors.length; i++) {
        detectors[i].update(fft);
    }


    for (var i = 0; i < spectrum.length; i++) {
        var x = map(i, 0, spectrum.length, 0, width);
        var h = -height + map(spectrum[i], 0, 255, height, 0);
        fill(spectrum[i], 255, 0, 127)
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

    bassSprite.attractionPoint(1, bass_attraction.x, bass_attraction.y);

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

function gotPeak(value, index) {

  if (index == 0) {
      bass_attraction.x = random(200, 400);
      bass_attraction.y = random(100, 300);
  } else if (index == 1) {
      midSprite.changeAnimation(midSprite.animationLabels[frameCount % midSprite.animationLabels.length])
  } else if (index == 2) {
      bg_color = color(random(255), random(127, 255), random(127, 255));
  } else if (index == 3) {
      trebleSprite.rotation = random(-45, 45);
  }
}