var pieces, radius, fft, mapMouseX, mapMouseY, toggleBtn, audio, uploadBtn, uploadedAudio, uploadAnim;

function preload() {
	audio = loadSound("assets/tracks/L.O.R.D.mp3");
}


function setup() {

	createCanvas(800, 400);

	fft = new p5.FFT();

	audio.loop();

    colorMode(HSB, 255);

	bassSprite = createSprite(200, 200);
	bassSprite.addAnimation('normal', 'assets/ghost_spin0001.png', 'assets/ghost_spin0003.png');

	midSprite = createSprite(400, 200);
	midSprite.addAnimation('normal', 'assets/asterisk_normal0001.png', 'assets/asterisk_normal0003.png');

	trebleSprite = createSprite(600, 200);
	trebleSprite.addAnimation('normal', 'assets/small_platform0001.png', 'assets/small_platform0003.png');
}

function draw() {

    //
    // I'm imagining the API here might look something like
    // setSides(bassEnergy);
    // setColor(trebleEnergy);
    // setSize(midEnergy);
    // and we would take care of scaling values behind the scenes.
    //


	background("white");

	noFill();

	fft.analyze();

	var bass = fft.getEnergy("bass");
	var treble = fft.getEnergy("treble");
	var mid = fft.getEnergy("mid");

	var posMid = map(mid, 0, 255, 200, 50);
	var scaleMid = map(mid, 0, 255, .5, 1.5);
	var sidesMid = map(mid, 0, 255, 3, 12);
	var rotationMid = map(mid, 0, 255, -180, 180);

	var posTreble = map(treble, 0, 255, 200, 50);
	var scaleTreble = map(treble, 0, 255, .5, 1.5);
	var sidesTreble = map(treble, 0, 5, 20);
	var rotationTreble = map(treble, 0, 255, -180, 180);

	var posBass = map(bass, 0, 255, 200, 50);
	var scaleBass = map(bass, 0, 255, .5, 1.5);
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