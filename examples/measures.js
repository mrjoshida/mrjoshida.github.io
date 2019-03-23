var songMetadata_ = {
    bpm: 120,
    delay: 0
}

var songStartTime_ = 0;

function setup() {
    createCanvas(400, 400);
    songStartTime_ = new Date();
}

function draw() {
    var current = getCurrentMeasure();
    background(200);
    text("Measure: " + getCurrentMeasure(), 0, 10);
    stroke("#00adbc");
    strokeWeight(5);
    line(50, 50, 350, 50);
    var beatX = 50 + (0 - current % 1) * 150;
    while (beatX <= 350) {
        if (beatX > 50) {
            line(beatX, 45, beatX, 55);
        }
        beatX += 37.5;
    }

    showMeasure(current, 2, 30);
    showMeasure(current, 1, 30);
    showMeasure(current, 0, 35);

}

function showMeasure(measure, offset, size) {
    var x;
    if (offset === 0) {
        x = 50;
    } else {
        x = 50 + ((offset - measure % 1) * 150);
    }
    push();
    fill("white");
    stroke("#00adbc");
    strokeWeight(5);
    ellipse(x, 50, size, size);
    noStroke();
    fill("black");
    textSize(size / 2);
    textAlign(CENTER, CENTER);
    text(Math.floor(measure) + offset, x, 50);
    pop();
}

function getCurrentMeasure() {
    return songMetadata_.bpm * ((getCurrentTime() - songMetadata_.delay) / 240) + 1;
}

function getCurrentTime() {
    return (new Date() - songStartTime_) / 1000;
}