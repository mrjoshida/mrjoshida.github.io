//Moving sprites
var ghost, circle, canvas;
var direction = 90; //circle initial direction moving down

function setup() {
  createCanvas(800, 400);

  input = createInput();
  button = createButton('submit');

  //create the sprites
  ghost = createSprite(600, 200, 50, 100);
  ghost.addAnimation('floating', 'assets/ghost_standing0001.png', 'assets/ghost_standing0007.png');
  ghost.saying = "";

  circle = createSprite(400, 200, 50, 100);
  circle.addAnimation('floating', 'assets/asterisk_circle0006.png', 'assets/asterisk_circle0008.png');

  circle.saying = "What's your name?";


  button.mousePressed(function() {
      var answer = input.value();
      if (circle.saying == "What's your name?") {

          ghost.saying = "My name is " + answer;
          circle.saying = "How old are you?";
      } else if (circle.saying == "How old are you?") {
          ghost.saying = "I am " + answer + " years old";
          circle.saying = "Wow!"
      }

      input.value('');
  });

}

function draw() {
  background(255, 255, 255);


  //aside of setting the velocity directly you can move a sprite
  //by providing a speed and an angle
  direction += 2;
  //speed, angle
  circle.setSpeed(3, direction);
  fill("black");

  //you can rotate the sprite according the direction it is moving
  //uncomment this
  //circle.rotateToDirection = true;

  //or by applying a force toward a point
  //force (acceleration), pointx, pointy
  ghost.attractionPoint(0.2, mouseX, mouseY);
  //since the force keeps incrementing the speed you can
  //set a limit to it with maxSpeed
  ghost.maxSpeed = 5;

  //draw the sprite
  drawSprites();
  text(circle.saying, circle.position.x + circle.width/2, circle.position.y - circle.height/2);
  text(ghost.saying, ghost.position.x + ghost.width/2, ghost.position.y - ghost.height/2);
}