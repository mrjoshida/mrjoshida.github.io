//Moving sprites
var ghost, circle, canvas, text_console, ctx;

function setup() {
  console_container = createDiv("");
  console_container.id('console');
  text_console = createDiv("");
  text_console.id('text_console');
  text_console.parent(console_container);
  text_console.timeout = 0;
  //console_container.hide();
  console_container.addClass('console_closed');

  text_console.mouseClicked(function () {
    text_console.style('max-height', "100px");
    text_console.timeout = millis() + 3000;
    stickToConsoleBottom();
  })

  ctx = createCanvas(400, 400);
  ctx.style('margin-top', '25px');

  //create the sprites
  ghost = createSprite(100, 200, 50, 100);
  ghost.addAnimation('floating', 'assets/ghost_standing0001.png', 'assets/ghost_standing0007.png');

  circle = createSprite(300, 200, 50, 100);
  circle.addAnimation('floating', 'assets/asterisk_circle0006.png', 'assets/asterisk_circle0008.png');

}

function draw() {
  background(127);
  if (keyWentDown("up")) {
      printText("up!");
  }
  if (keyWentDown("down")) {
      printText("down!");
  }
  if (keyWentDown("left")) {
      printText("left!");
  }
  if (keyWentDown("right")) {
      printText("right!");
  }
  drawSprites();
  collapseConsole();
}

function printText(text) {
  text_console.timeout = millis() + 3000;
  text_console.style('max-height', "100px");
  text_console.style('height', 'auto');
  text_console.html("<p>" + text + "</p>", true);
  console_container.removeClass('console_closed');
  //console_container.show();
  stickToConsoleBottom()
}

function collapseConsole() {
  var time = millis();
  if (text_console.timeout <= millis() && text_console.elt.clientHeight > 25) {
    text_console.style('height', Math.max(25, text_console.elt.clientHeight - 5) + "px");
    text_console.style('max-height', "25px");
    stickToConsoleBottom();
  }
}

function stickToConsoleBottom() {
  text_console.elt.scrollTop = text_console.elt.scrollHeight;
}