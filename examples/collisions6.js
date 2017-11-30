// Collision detection - advanced custom colliders
// Colliders will respond to the sprite's position, scale and rotation.
// They can also have their own position, scale and rotation (depending on the
// collider type).

var point;
var circle;
var square1, square2;
var hero;

function setup() {
  createCanvas(800, 400);

  point = createSprite(100, 200);
  point.shapeColor = 'white';
  point.scale = 0.25;
  point.setCollider('point', 20, 0);
  point.rotationSpeed = -0.3;

  circle = createSprite(300, 200);
  circle.addAnimation('normal', 'assets/sun1.png', 'assets/sun3.png');
  circle.setCollider('circle', 15, -5, 30);
  circle.collider.scale = 0.4;
  circle.rotationSpeed = -0.3;

  square1 = createSprite(500, 200);
  square1.addAnimation('normal', 'assets/bubbly0001.png', 'assets/bubbly0004.png');
  square1.setCollider('aabb', 0, 26, 75, 75);
  square1.collider.offset = new p5.Vector(0, 26);
  square1.rotationSpeed = 0.3;

  square2 = createSprite(700, 200);
  square2.addAnimation('normal', 'assets/bubbly0001.png', 'assets/bubbly0004.png');
  square2.setCollider('obb', 0, 26, 75, 75);
  square2.rotationSpeed = 0.3;

  // Circle that follows the mouse
  hero = createSprite(0, 0);
  hero.addAnimation('normal', 'assets/asterisk_circle0006.png', 'assets/asterisk_circle0008.png');
  hero.scale = 0.5;
  hero.setCollider('circle', -2, 2, 55);

  // Enable debug drawing for all sprites
  for (var i = 0; i < allSprites.length; i++) {
    allSprites[i].debug = true;
  }
}

function draw() {
  background(255, 255, 255);

  // Follow the mouse
  hero.velocity.x = (mouseX-hero.position.x) / 10;
  hero.velocity.y = (mouseY-hero.position.y) / 10;

  // Shift sprites with mouseX to show colliders following positions.
  point.position.x = 100 - (mouseX - 100) / 10;
  circle.position.x = 300 - (mouseX - 300) / 30;
  square1.position.x = 500 + (mouseX - 500) / 30;
  square2.position.x = 700 + (mouseX - 700) / 10;

  // Scale sprites with mouseY to show colliders following positions.
  var scale = 1 + (mouseY - 200) / 800;
  point.scale = scale;
  circle.scale = scale;
  square1.scale = scale;
  square2.scale = scale;

  hero.collide(point);
  hero.collide(circle);
  hero.collide(square1);
  hero.collide(square2);

  textAlign(CENTER, CENTER);
  textSize(25);
  fill('#666');
  text('point', point.position.x, 300);
  text('circle', circle.position.x, 300);
  text('AABB', square1.position.x, 300);
  text('OBB', square2.position.x, 300);

  drawSprites();
}
