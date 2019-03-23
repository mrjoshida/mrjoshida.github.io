var pieces, radius, fft, mapMouseX, mapMouseY, toggleBtn, audio, uploadBtn, uploadedAudio, uploadAnim;

function preload() {
	audio = loadSound("assets/tracks/L.O.R.D.mp3");
}


function setup() {

	createCanvas(400, 400);

	fft = new p5.FFT();

	audio.loop();

    colorMode(HSB, 255);
}

function draw() {

    //
    // I'm imagining the API here might look something like
    // setSides(bassEnergy);
    // setColor(trebleEnergy);
    // setSize(midEnergy);
    // and we would take care of scaling values behind the scenes.
    //


	background("black");

	noFill();

	fft.analyze();

	var bass = fft.getEnergy("bass");
	var treble = fft.getEnergy("treble");
	var mid = fft.getEnergy("mid");

	var mapMid = map(mid, 0, 255, 0, 300);
	var scaleMid = map(mid, 0, 255, .5, 1.5);
	var sidesMid = map(mid, 0, 255, 3, 12);

	var mapTreble = map(treble, 0, 255, -radius, radius);
	var scaleTreble = map(treble, 0, 255, .5, 1.5);
	var sidesTreble = map(treble, 0, 5, 20);

	var mapBass = map(bass, 0, 255, -100, 800);
	var scaleBass = map(bass, 0, 255, 0, 0.8);
	var sidesBass = map(bass, 0, 255, 3, 12);

	translate(width / 2, height / 2);

	noStroke();
	rectMode("center");


	fill(treble, 255, bass);
	scale(scaleMid);
	polygon(0, 0, mapMid, sidesBass);

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