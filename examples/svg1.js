// Pure SVG animations
// Currently p5play animations don't allow for svg
// so drawing them manually

var images = [];

function preload() {
    for (var i=0; i<24; i++) {
        // images.push(loadImage('assets/svg/bear' + i + '.svg')); // Direct export from bodymovin
        images.push(loadImage('assets/svgo/bear' + i + '.svg')); // Optimized with SVGO
    }
    console.log(images)
}

function setup() {
  createCanvas(400, 400);
  frameRate(24);
}

function draw() {
  background(255, 255, 255);
  for (var i = 63; i>=0; i--)
  image(images[frameCount % 24], (i % 8) * 50, Math.floor(i / 8) * 50, mouseX, mouseX);
}
