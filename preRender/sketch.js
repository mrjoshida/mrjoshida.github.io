// first try at live beat detection from fft data
// contains two classes : one for onset detection - OnsetDetect and one to detect when amplitude reaches a certain treshold - BeatDetect (probably ill named)

var file ='https://curriculum.code.org/media/uploads/feeling.mp3'

var file_input, delay, bass_threshold, mid_threshold, treble_threshold;
var play_button, save_button;

var song_meta = {
  url: file,
  bpm: 133
};

var low, mid, high;

var amplitude;

var source_file; // sound file
var src_length; // hold its duration

var fft;

var beats = [0,0,0];

var analysis = [];

// detectors listen for peaks


function preload(){
  source_file = loadSound(file); // preload the sound
}

function setup() {
  frameRate(24);
  createCanvas(400, 400);
  noStroke();


  src_length = source_file.duration();
  //println("source duration: " +src_length);

  // draw the waveform to an off-screen graphic
  var peaks = source_file.getPeaks(); // get an array of peaks


    // FFT
   fft = new p5.FFT();

   var delay = 24 / (song_meta.bpm / 60);

   // low band : 40Hz-120Hz
   low = new p5.PeakDetect(10, 300, 0.80, 5);

   // lowMid band : 140Hz-400Hz
   mid = new p5.PeakDetect(300, 2400, 0.50, 5);

   // mid band : 400Hz-2.6kHz
   high = new p5.PeakDetect(2400, 20000, 0.25, 5);

   amplitude = new p5.Amplitude(0.5);

   //source_file.play();

  file_input = createInput(file, "url");
  file_input.position(20, 20);
  file_input.size(300);
  play_button = createButton("play");
  play_button.position(file_input.x + file_input.width, 20);
  play_button.mousePressed(startAnalysis);
  save_button = createButton("save JSON");
  save_button.position(20, 50);
  save_button.id("save_button");
}


function draw() {
  fill("white");
	rect(0, 100, 400, 300);

	if (!source_file.isPlaying) return;

  fft.analyze();
  low.update(fft);
  mid.update(fft);
  high.update(fft);

	var frame = {
	  time: source_file.currentTime(),
    beats: [low.isDetected, mid.isDetected, high.isDetected],
    energy: [fft.getEnergy("bass"), fft.getEnergy("mid"), fft.getEnergy("treble")],
    volume: amplitude.getLevel()
  };

  textAlign(CENTER, CENTER);
	text(frame.time, 200, 50, 400, 100);

	fill("#00adbc");
	for (var i=0; i<3; i++) {
	  if (frame.beats[i]) {
	    beats[i] = 100;
    }
	  ellipse(100 + (i*100), 150, beats[i], beats[i]);
	  rect(75 + (i*100), 400 - frame.energy[i], 50, frame.energy[i]);
	  beats[i] *= 0.9;
  }

  analysis.push(frame);

  if (source_file.currentTime()>=src_length-0.05){
    window.analysis = analysis;
    background("green");
    text("Done", 100, 100, 100, 100);
    console.log(analysis);
    noLoop();
  }

}

function startAnalysis() {
  file = file_input.value();
  preload();
  source_file.play();
}
