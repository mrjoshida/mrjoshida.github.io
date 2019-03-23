// SVGs as sprite animations
// requires edits to p5.play

var bear, dance;

function preload() {
    dance = loadAnimation('assets/svgo/bear0.svg', 'assets/svgo/bear23.svg');
    dance.frameDelay = 1;
}

function setup() {
    createCanvas(400, 400);
    frameRate(24);

    for (var i=0; i<64; i++) {
        bear = createSprite(25 + ((i % 8) * 50), 25 + (Math.floor(i / 8) * 50));
        bear.addAnimation('dance', dance);
        bear.scale = 0.2;
    }
}

function draw() {
    background(255, 255, 255);
    drawSprites();
}
