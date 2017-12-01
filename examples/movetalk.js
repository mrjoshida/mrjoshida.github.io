//keyboard events
//capturing key presses and mouse buttons once
//press x and z or mouse left and right

var asterisk;
var ghost;
var platform;
var name


function setup() {
  createCanvas(800, 400);

  input = createInput();
  button = createButton('submit');

  ghost = createSprite(600, 200);
  ghost.addAnimation('normal', 'assets/ghost_spin0001.png', 'assets/ghost_spin0003.png');

  asterisk = createSprite(200, 100);
  asterisk.addAnimation('normal', 'assets/asterisk_normal0001.png', 'assets/asterisk_normal0003.png');
  asterisk.addAnimation('stretch', 'assets/asterisk_stretching0001.png', 'assets/asterisk_stretching0008.png');

  //if defined, the collider will be used for mouse events
  asterisk.setCollider('circle', 0, 0, 64);

  platform = createSprite(200, 300);
  platform.addAnimation('normal', 'assets/small_platform0001.png', 'assets/small_platform0003.png');

  asterisk.saying = "What's my name?";
  name = "";


  button.mousePressed(function() {
      name = input.value();
      asterisk.saying = "";
      input.value('');
  });


}

function draw() {
  background(255, 255, 255);

  fill(200);
  textAlign(CENTER);

  if (asterisk.overlap(ghost) && name != "") {
      ghost.saying = "Howdy, " + name;
  } else {
      ghost.saying = "";
  }

  if (asterisk.overlap(platform) && name != "") {
      platform.saying = "Nice to see you " + name;
  } else {
      platform.saying = "";
  }

  //same as keyWentDown
  //RIGHT = right mouse button
  if(keyDown("left"))
    asterisk.position.x-=5;

  if(keyDown("right"))
    asterisk.position.x+=5;

  if(keyDown("up"))
    asterisk.position.y-=5;

  if(keyDown("down"))
    asterisk.position.y+=5;

  drawSprites();

  for (var i=0; i<allSprites.length; i++) {
      var sprite = allSprites[i];
      if (sprite.saying) {
          fill("black");
          text(sprite.saying, sprite.position.x + sprite.width / 2, sprite.position.y - sprite.height / 2);
      }
  }
}
