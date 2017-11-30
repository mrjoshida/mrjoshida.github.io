describe('AxisAlignedBoundingBoxCollider', function() {
  var MARGIN_OF_ERROR = 0.000001;

  var a, b;
  beforeEach(function() {
    a = new p5.AxisAlignedBoundingBoxCollider(new p5.Vector(0, 0), 10, 10);
    b = new p5.AxisAlignedBoundingBoxCollider(new p5.Vector(0, 0), 10, 10);
  });

  it('stores properties', function() {
    var a = new p5.AxisAlignedBoundingBoxCollider(new p5.Vector(3, 4), 1, 2);
    expect(a.width).to.equal(1);
    expect(a.height).to.equal(2);
    expect(a.center.x).to.equal(3);
    expect(a.center.y).to.equal(4);
  });

  it('detects no collision when separated', function() {
    var testPositionsForB = [
      new p5.Vector(10, 0),
      new p5.Vector(0, 10),
      new p5.Vector(10, 10),
      new p5.Vector(-10, 0)
    ];

    testPositionsForB.forEach(function(position) {
      b.center = position;
      var displacement = a.collide(b);
      expect(displacement.x).to.equal(0);
      expect(displacement.y).to.equal(0);
    });
  });

  it('detects overlap when b to the right', function() {
    b.center = new p5.Vector(9, 0);
    var displacement = a.collide(b);
    expect(displacement.x).to.equal(-1);
    expect(displacement.y).to.equal(0);
  });

  it('detects overlap when b to the left', function() {
    b.center = new p5.Vector(-9, 0);
    var displacement = a.collide(b);
    expect(displacement.x).to.equal(1);
    expect(displacement.y).to.equal(0);
  });

  it('detects overlap when b is above', function() {
    b.center = new p5.Vector(0, -9);
    var displacement = a.collide(b);
    expect(displacement.x).to.be.closeTo(0, MARGIN_OF_ERROR);
    expect(displacement.y).to.be.closeTo(1, MARGIN_OF_ERROR);
  });

  it('detects overlap when b is below', function() {
    b.center = new p5.Vector(0, 9);
    var displacement = a.collide(b);
    expect(displacement.x).to.be.closeTo(0, MARGIN_OF_ERROR);
    expect(displacement.y).to.be.closeTo(-1, MARGIN_OF_ERROR);
  });

  it('picks smallest overlap when overlap occurs on both axes', function() {
    // Here the y-axis overlap is smaller, so that should be our exit vector
    b.center = new p5.Vector(8, 9);
    var displacement = a.collide(b);
    expect(displacement.x).to.be.closeTo(0, MARGIN_OF_ERROR);
    expect(displacement.y).to.be.closeTo(-1, MARGIN_OF_ERROR);
  });

  describe('updateFromSprite()', function() {
    var pInst, testAnimation;

    beforeEach(function() {
      pInst = new p5(function() {});
      testAnimation = createTestAnimation(3);
    });

    afterEach(function() {
      pInst.remove();
    });

    it('adopts dimensions from animationless sprite when no dimensions are given, scale 1', function() {
      var sprite = pInst.createSprite(0, 0, 200, 210);
      sprite.setCollider('aabb');
      expect(sprite.collider.width).to.equal(200);
      expect(sprite.collider.height).to.equal(210);
      expect(sprite.collider.getBoundingBox().width).to.equal(200);
      expect(sprite.collider.getBoundingBox().height).to.equal(210);

      sprite.width = 300;
      sprite.height = 310;
      sprite.update();
      expect(sprite.collider.width).to.equal(300);
      expect(sprite.collider.height).to.equal(310);
      expect(sprite.collider.getBoundingBox().width).to.equal(300);
      expect(sprite.collider.getBoundingBox().height).to.equal(310);
    });

    it('keeps own dimensions from animationless sprite when dimensions are given, scale 1', function() {
      var sprite = pInst.createSprite(0, 0, 200, 210);
      sprite.setCollider('aabb', 0, 0, 25, 35);
      expect(sprite.collider.width).to.equal(25);
      expect(sprite.collider.height).to.equal(35);
      expect(sprite.collider.getBoundingBox().width).to.equal(25);
      expect(sprite.collider.getBoundingBox().height).to.equal(35);

      sprite.width = 300;
      sprite.height = 300;
      sprite.update();
      expect(sprite.collider.width).to.equal(25);
      expect(sprite.collider.height).to.equal(35);
      expect(sprite.collider.getBoundingBox().width).to.equal(25);
      expect(sprite.collider.getBoundingBox().height).to.equal(35);
    });

    it('adopts scaled dimensions from animationless sprite when no dimensions are given, scale != 1', function() {
      var sprite = pInst.createSprite(0, 0, 200, 210);
      sprite.scale = 2;
      sprite.setCollider('aabb');
      expect(sprite.collider.width).to.equal(200);
      expect(sprite.collider.height).to.equal(210);
      expect(sprite.collider.getBoundingBox().width).to.equal(400);
      expect(sprite.collider.getBoundingBox().height).to.equal(420);

      sprite.width = 300;
      sprite.height = 310;
      sprite.update();
      expect(sprite.collider.width).to.equal(300);
      expect(sprite.collider.height).to.equal(310);
      expect(sprite.collider.getBoundingBox().width).to.equal(600);
      expect(sprite.collider.getBoundingBox().height).to.equal(620);

      sprite.scale = 3;
      sprite.update();
      expect(sprite.collider.width).to.equal(300);
      expect(sprite.collider.height).to.equal(310);
      expect(sprite.collider.getBoundingBox().width).to.equal(900);
      expect(sprite.collider.getBoundingBox().height).to.equal(930);
    });

    it('scales own dimensions from animationless sprite when dimensions are given, scale != 1', function() {
      var sprite = pInst.createSprite(0, 0, 200, 210);
      sprite.scale = 2;
      sprite.setCollider('aabb', 0, 0, 25, 35);
      expect(sprite.collider.width).to.equal(25);
      expect(sprite.collider.height).to.equal(35);
      expect(sprite.collider.getBoundingBox().width).to.equal(50);
      expect(sprite.collider.getBoundingBox().height).to.equal(70);

      sprite.width = 300;
      sprite.height = 310;
      sprite.update();
      expect(sprite.collider.width).to.equal(25);
      expect(sprite.collider.height).to.equal(35);
      expect(sprite.collider.getBoundingBox().width).to.equal(50);
      expect(sprite.collider.getBoundingBox().height).to.equal(70);

      sprite.scale = 3;
      sprite.update();
      expect(sprite.collider.width).to.equal(25);
      expect(sprite.collider.height).to.equal(35);
      expect(sprite.collider.getBoundingBox().width).to.equal(75);
      expect(sprite.collider.getBoundingBox().height).to.equal(105);
    });

    it('adopts animation dimensions from sprite with animation when no dimensions are given, scale 1', function() {
      var sprite = pInst.createSprite(0, 0, 200, 210);
      sprite.addAnimation('testAnim', testAnimation);
      sprite.setCollider('aabb');
      // Frames in the test animation are 50x55
      expect(sprite.collider.width).to.equal(50);
      expect(sprite.collider.height).to.equal(55);
      expect(sprite.collider.getBoundingBox().width).to.equal(50);
      expect(sprite.collider.getBoundingBox().height).to.equal(55);

      sprite.width = 300;
      sprite.height = 310;
      sprite.update();
      expect(sprite.collider.width).to.equal(50);
      expect(sprite.collider.height).to.equal(55);
      expect(sprite.collider.getBoundingBox().width).to.equal(50);
      expect(sprite.collider.getBoundingBox().height).to.equal(55);
    });

    it('keeps own dimensions from sprite with animation when dimensions are given, scale 1', function() {
      var sprite = pInst.createSprite(0, 0, 200, 210);
      sprite.addAnimation('testAnim', testAnimation);
      sprite.setCollider('aabb', 0, 0, 25, 35);
      expect(sprite.collider.width).to.equal(25);
      expect(sprite.collider.height).to.equal(35);
      expect(sprite.collider.getBoundingBox().width).to.equal(25);
      expect(sprite.collider.getBoundingBox().height).to.equal(35);

      sprite.width = 300;
      sprite.height = 310;
      sprite.update();
      expect(sprite.collider.width).to.equal(25);
      expect(sprite.collider.height).to.equal(35);
      expect(sprite.collider.getBoundingBox().width).to.equal(25);
      expect(sprite.collider.getBoundingBox().height).to.equal(35);
    });

    it('adopts scaled animation dimensions from sprite with animation when no dimensions are given, scale != 1', function() {
      var sprite = pInst.createSprite(0, 0, 200, 210);
      sprite.addAnimation('testAnim', testAnimation);
      sprite.scale = 2;
      sprite.setCollider('aabb');
      // Frames in the test animation are 50x55
      expect(sprite.collider.width).to.equal(50);
      expect(sprite.collider.height).to.equal(55);
      expect(sprite.collider.getBoundingBox().width).to.equal(100);
      expect(sprite.collider.getBoundingBox().height).to.equal(110);

      sprite.width = 300;
      sprite.height = 310;
      sprite.update();
      expect(sprite.collider.width).to.equal(50);
      expect(sprite.collider.height).to.equal(55);
      expect(sprite.collider.getBoundingBox().width).to.equal(100);
      expect(sprite.collider.getBoundingBox().height).to.equal(110);

      sprite.scale = 3;
      sprite.update();
      expect(sprite.collider.width).to.equal(50);
      expect(sprite.collider.height).to.equal(55);
      expect(sprite.collider.getBoundingBox().width).to.equal(150);
      expect(sprite.collider.getBoundingBox().height).to.equal(165);
    });

    it('scales own dimensions from sprite with animation when dimensions are given, scale != 1', function() {
      var sprite = pInst.createSprite(0, 0, 200, 200);
      sprite.addAnimation('testAnim', testAnimation);
      sprite.scale = 2;
      sprite.setCollider('aabb', 0, 0, 25, 35);
      expect(sprite.collider.width).to.equal(25);
      expect(sprite.collider.height).to.equal(35);
      expect(sprite.collider.getBoundingBox().width).to.equal(50);
      expect(sprite.collider.getBoundingBox().height).to.equal(70);

      sprite.width = 300;
      sprite.height = 300;
      sprite.update();
      expect(sprite.collider.width).to.equal(25);
      expect(sprite.collider.height).to.equal(35);
      expect(sprite.collider.getBoundingBox().width).to.equal(50);
      expect(sprite.collider.getBoundingBox().height).to.equal(70);

      sprite.scale = 3;
      sprite.update();
      expect(sprite.collider.width).to.equal(25);
      expect(sprite.collider.height).to.equal(35);
      expect(sprite.collider.getBoundingBox().width).to.equal(75);
      expect(sprite.collider.getBoundingBox().height).to.equal(105);
    });

    /**
     * Makes a fake animation with the specified number of frames.
     * @param {number} frameCount
     * @returns {p5.Animation}
     */
    function createTestAnimation(frameCount) {
      frameCount = frameCount || 1;
      var image = new p5.Image(100, 100, pInst);
      var frames = [];
      for (var i = 0; i < frameCount; i++) {
        frames.push({name: i, frame: {x: 0, y: 0, width: 50, height: 55}});
      }
      var sheet = new pInst.SpriteSheet(image, frames);
      var animation = new pInst.Animation(sheet);
      animation.frameDelay = 1;
      return animation;
    }
  });
});
