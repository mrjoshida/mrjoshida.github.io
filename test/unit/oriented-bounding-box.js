describe('OrientedBoundingBoxCollider', function() {
  var MARGIN_OF_ERROR = 0.000001;

  it('stores properties', function() {
    var a = new p5.OrientedBoundingBoxCollider(new p5.Vector(3, 4), 1, 2, 2.5);
    expect(a.width).to.equal(1);
    expect(a.height).to.equal(2);
    expect(a.center.x).to.equal(3);
    expect(a.center.y).to.equal(4);
    expect(a.rotation).to.equal(2.5);
  });

  describe('axis-aligned boxes', function() {
    var a, b;
    beforeEach(function() {
      a = new p5.OrientedBoundingBoxCollider(new p5.Vector(0, 0), 10, 10, 0);
      b = new p5.OrientedBoundingBoxCollider(new p5.Vector(0, 0), 10, 10, 0);
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
  });

  describe('one long box rotated 90deg', function() {
    var a, b;
    beforeEach(function() {
      a = new p5.OrientedBoundingBoxCollider(new p5.Vector(0, 0), 10, 4, Math.PI / 2);
      b = new p5.OrientedBoundingBoxCollider(new p5.Vector(0, 0), 10, 10, 0);
    });

    it('detects no collision when separated', function() {
      var testPositionsForB = [
        new p5.Vector(7 + MARGIN_OF_ERROR, 0)
      ];

      testPositionsForB.forEach(function(position) {
        b.center = position;
        var displacement = a.collide(b);
        expect(displacement.x).to.equal(0);
        expect(displacement.y).to.equal(0);
      });
    });
  });

  describe('Two 45deg rotated boxes', function() {
    var a, b;
    beforeEach(function() {
      a = new p5.OrientedBoundingBoxCollider(new p5.Vector(0, 0), 10, 10, Math.PI / 4);
      b = new p5.OrientedBoundingBoxCollider(new p5.Vector(0, 0), 10, 10, Math.PI / 4);
    });

    it('detects no collision when separated', function() {
      var axisSeparation = (10 + MARGIN_OF_ERROR) / Math.SQRT2;
      var testPositionsForB = [
        new p5.Vector(axisSeparation, axisSeparation),
        new p5.Vector(axisSeparation, -axisSeparation),
        new p5.Vector(-axisSeparation, -axisSeparation),
        new p5.Vector(-axisSeparation, axisSeparation)
      ];

      testPositionsForB.forEach(function(position) {
        b.center = position;
        var displacement = a.collide(b);
        expect(displacement.x).to.equal(0);
        expect(displacement.y).to.equal(0);
      });
    });

    it('detects overlap when b up and to the right', function() {
      var axisSeparation = 9 / Math.SQRT2;
      b.center = new p5.Vector(axisSeparation, -axisSeparation);
      var displacement = a.collide(b);
      expect(displacement.x).to.be.closeTo(-1 / Math.SQRT2, MARGIN_OF_ERROR);
      expect(displacement.y).to.be.closeTo(1 / Math.SQRT2, MARGIN_OF_ERROR);
    });

    it('detects overlap when b up and to the left', function() {
      var axisSeparation = 9 / Math.SQRT2;
      b.center = new p5.Vector(-axisSeparation, -axisSeparation);
      var displacement = a.collide(b);
      expect(displacement.x).to.be.closeTo(1 / Math.SQRT2, MARGIN_OF_ERROR);
      expect(displacement.y).to.be.closeTo(1 / Math.SQRT2, MARGIN_OF_ERROR);
    });

    it('detects overlap when b down and to the right', function() {
      var axisSeparation = 9 / Math.SQRT2;
      b.center = new p5.Vector(axisSeparation, axisSeparation);
      var displacement = a.collide(b);
      expect(displacement.x).to.be.closeTo(-1 / Math.SQRT2, MARGIN_OF_ERROR);
      expect(displacement.y).to.be.closeTo(-1 / Math.SQRT2, MARGIN_OF_ERROR);
    });

    it('detects overlap when b down and to the left', function() {
      var axisSeparation = 9 / Math.SQRT2;
      b.center = new p5.Vector(-axisSeparation, axisSeparation);
      var displacement = a.collide(b);
      expect(displacement.x).to.be.closeTo(1 / Math.SQRT2, MARGIN_OF_ERROR);
      expect(displacement.y).to.be.closeTo(-1 / Math.SQRT2, MARGIN_OF_ERROR);
    });

    it('picks smallest overlap', function() {
      // Here b is down a little and to the right quite a bit.  Expect to
      // displace diagonally up-left.
      b.center = new p5.Vector(1, 3);
      var displacement = a.collide(b);
      expect(displacement.x).to.be.closeTo(-5.0710678, MARGIN_OF_ERROR);
      expect(displacement.y).to.be.closeTo(-5.0710678, MARGIN_OF_ERROR);
    });
  });

  describe('0deg box vs 30deg box', function() {
    var a, b;
    beforeEach(function() {
      a = new p5.OrientedBoundingBoxCollider(new p5.Vector(0, 0), 10, 10, 0);
      b = new p5.OrientedBoundingBoxCollider(new p5.Vector(0, 0), 10, 10, Math.PI / 3);
    });

    it('detects no collision when separated', function() {
      var testPositionsForB = [
        new p5.Vector(11.84, 0),   // E
        new p5.Vector(10, 7.89),   // ESE
        new p5.Vector(7.89, 10),   // SSE
        new p5.Vector(0, 11.84),   // S
        new p5.Vector(-7.89, 10),  // SSW
        new p5.Vector(-10, 7.89),  // WSW
        new p5.Vector(-11.84, 0),  // W
        new p5.Vector(-10, -7.89), // WNW
        new p5.Vector(-7.89, -10), // NNW
        new p5.Vector(0, -11.89),  // N
        new p5.Vector(7.89, -10),  // NNE
        new p5.Vector(10, -7.89),  // ENE
      ];

      testPositionsForB.forEach(function(position) {
        b.center = position;
        var displacement = a.collide(b);
        expect(displacement.x).to.equal(0);
        expect(displacement.y).to.equal(0);
      });
    });
  });

  describe('0deg box vs 45deg box', function() {
    var a, b;
    beforeEach(function() {
      a = new p5.OrientedBoundingBoxCollider(new p5.Vector(0, 0), 10, 10, 0);
      b = new p5.OrientedBoundingBoxCollider(new p5.Vector(0, 0), 10, 10, Math.PI / 4);
    });

    it('detects no collision when separated', function() {
      var testPositionsForB = [
        new p5.Vector(12.08, 0),     // right
        new p5.Vector(8.54, 8.54),   // down-right
        new p5.Vector(0, 12.08),     // down
        new p5.Vector(-8.54, 8.54),  // down-left
        new p5.Vector(-12.08, 0),    // left
        new p5.Vector(-8.54, -8.54), // up-left
        new p5.Vector(0, -12.08),    // up
        new p5.Vector(8.54, -8.54)   // up-right
      ];

      testPositionsForB.forEach(function(position) {
        b.center = position;
        var displacement = a.collide(b);
        expect(displacement.x).to.equal(0);
        expect(displacement.y).to.equal(0);
      });
    });

    it('smallest displacement aligned with a', function() {
      var displacement;

      // b directly to the right
      b.center = new p5.Vector(10, 0);
      displacement = a.collide(b);
      expect(displacement.x).to.be.closeTo(-2.0710678, MARGIN_OF_ERROR);
      expect(displacement.y).to.be.closeTo(0, MARGIN_OF_ERROR);

      // b to the right and up quite a bit
      b.center = new p5.Vector(10, -4);
      displacement = a.collide(b);
      expect(displacement.x).to.be.closeTo(-2.0710678, MARGIN_OF_ERROR);
      expect(displacement.y).to.be.closeTo(0, MARGIN_OF_ERROR);

      // b directly up
      b.center = new p5.Vector(0, -10);
      displacement = a.collide(b);
      expect(displacement.x).to.be.closeTo(0, MARGIN_OF_ERROR);
      expect(displacement.y).to.be.closeTo(2.0710678, MARGIN_OF_ERROR);

      // b up and to the right quite a bit
      b.center = new p5.Vector(4, -10);
      displacement = a.collide(b);
      expect(displacement.x).to.be.closeTo(0, MARGIN_OF_ERROR);
      expect(displacement.y).to.be.closeTo(2.0710678, MARGIN_OF_ERROR);
    });

    it('smallest displacement aligned with b', function() {
      var displacement;

      // b up-right
      b.center = new p5.Vector(8, -8);
      displacement = a.collide(b);
      expect(displacement.x).to.be.closeTo(-0.535533, MARGIN_OF_ERROR);
      expect(displacement.y).to.be.closeTo(0.535533, MARGIN_OF_ERROR);

      // b down-right
      b.center = new p5.Vector(8, 8);
      displacement = a.collide(b);
      expect(displacement.x).to.be.closeTo(-0.535533, MARGIN_OF_ERROR);
      expect(displacement.y).to.be.closeTo(-0.535533, MARGIN_OF_ERROR);

      // b down-left
      b.center = new p5.Vector(-8, 8);
      displacement = a.collide(b);
      expect(displacement.x).to.be.closeTo(0.535533, MARGIN_OF_ERROR);
      expect(displacement.y).to.be.closeTo(-0.535533, MARGIN_OF_ERROR);

      // b up-left
      b.center = new p5.Vector(-8, -8);
      displacement = a.collide(b);
      expect(displacement.x).to.be.closeTo(0.535533, MARGIN_OF_ERROR);
      expect(displacement.y).to.be.closeTo(0.535533, MARGIN_OF_ERROR);
    });
  });

  describe('can deduplicate potential separating axes', function() {
    var a, b;

    beforeEach(function() {
      a = new p5.OrientedBoundingBoxCollider(new p5.Vector(), 1, 1);
      b = new p5.OrientedBoundingBoxCollider(new p5.Vector(), 1, 1);
    });

    it('for unrotated OBBs', function() {
      var candidateAxes = p5.CollisionShape._getCandidateAxesForShapes(a, b);
      expect(candidateAxes.length).to.equal(2);
    });

    it('for same-rotated OBBs', function() {
      a.rotation = Math.PI / 4;
      b.rotation = Math.PI / 4;
      var candidateAxes = p5.CollisionShape._getCandidateAxesForShapes(a, b);
      expect(candidateAxes.length).to.equal(2);
    });

    it('for 0deg vs 90deg', function() {
      a.rotation = 0;
      b.rotation = Math.PI / 2;
      var candidateAxes = p5.CollisionShape._getCandidateAxesForShapes(a, b);
      expect(candidateAxes.length).to.equal(2);
    });

    it('for 45deg vs -45deg', function() {
      a.rotation = Math.PI / 4;
      b.rotation = -Math.PI / 4;
      var candidateAxes = p5.CollisionShape._getCandidateAxesForShapes(a, b);
      expect(candidateAxes.length).to.equal(2);
    });

    it('for 30deg vs -60deg', function() {
      a.rotation = Math.PI / 3;
      b.rotation = -2 * Math.PI / 3;
      var candidateAxes = p5.CollisionShape._getCandidateAxesForShapes(a, b);
      expect(candidateAxes.length).to.equal(2);
    });
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
      sprite.setCollider('obb');
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
      sprite.setCollider('obb', 0, 0, 25, 35);
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
      sprite.setCollider('obb');
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
      sprite.setCollider('obb', 0, 0, 25, 35);
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
      sprite.setCollider('obb');
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
      sprite.setCollider('obb', 0, 0, 25, 35);
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
      sprite.setCollider('obb');
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
      sprite.setCollider('obb', 0, 0, 25, 35);
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
