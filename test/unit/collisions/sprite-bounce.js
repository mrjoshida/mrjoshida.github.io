/** @file Tests for Sprite.bounce(sprite) behavior */
describe('sprite.bounce(sprite)', function() {
  var SIZE = 10;
  var pInst;
  var spriteA, spriteB;
  var callCount, pairs;

  function testCallback(a, b) {
    callCount++;
    pairs.push([a.name, b.name]);
  }

  function moveAToB(a, b) {
    a.position.x = b.position.x;
  }

  beforeEach(function() {
    pInst = new p5(function() {
    });
    callCount = 0;
    pairs = [];

    function createTestSprite(letter, position) {
      var sprite = pInst.createSprite(position, 0, SIZE, SIZE);
      sprite.name = 'sprite' + letter;
      return sprite;
    }

    spriteA = createTestSprite('A', 2 * SIZE);
    spriteB = createTestSprite('B', 4 * SIZE);

    // Assert initial test state:
    // - Two total sprites
    // - no two sprites overlap
    expect(pInst.allSprites.length).to.equal(2);
    pInst.allSprites.forEach(function(caller) {
      pInst.allSprites.forEach(function(callee) {
        expect(caller.overlap(callee)).to.be.false;
      });
    });
  });

  afterEach(function() {
    pInst.remove();
  });

  it('false if sprites do not overlap', function() {
    expect(spriteA.bounce(spriteB)).to.be.false;
    expect(spriteB.bounce(spriteA)).to.be.false;
  });

  it('true if sprites overlap', function() {
    moveAToB(spriteA, spriteB);
    expect(spriteA.bounce(spriteB)).to.be.true;

    moveAToB(spriteA, spriteB);
    expect(spriteB.bounce(spriteA)).to.be.true;
  });

  it('calls callback once if sprites overlap', function() {
    expect(callCount).to.equal(0);

    moveAToB(spriteA, spriteB);
    spriteA.bounce(spriteB, testCallback);
    expect(callCount).to.equal(1);

    moveAToB(spriteA, spriteB);
    spriteB.bounce(spriteA, testCallback);
    expect(callCount).to.equal(2);
  });

  it('does not call callback if sprites do not overlap', function() {
    expect(callCount).to.equal(0);
    spriteA.bounce(spriteB, testCallback);
    expect(callCount).to.equal(0);
    spriteB.bounce(spriteA, testCallback);
    expect(callCount).to.equal(0);
  });

  describe('passes collider and collidee to callback', function() {
    it('A-B', function() {
      moveAToB(spriteA, spriteB);
      spriteA.bounce(spriteB, testCallback);
      expect(pairs).to.deep.equal([[spriteA.name, spriteB.name]]);
    });

    it('B-A', function() {
      moveAToB(spriteA, spriteB);
      spriteB.bounce(spriteA, testCallback);
      expect(pairs).to.deep.equal([[spriteB.name, spriteA.name]]);
    });
  });

  it('passes all velocity from a moving object to a stationary one in an equal-mass perfectly elastic collision', function() {
    var expectedOverlap = 2;
    spriteA.position.x = spriteB.position.x - (spriteA.width - expectedOverlap);
    spriteA.velocity.x = 3;
    spriteB.velocity.x = 0;
    spriteA.mass = 1;
    spriteB.mass = 1;
    spriteA.restitution = 1;
    spriteB.restitution = 1;

    var spriteAInitialPosition = spriteA.position.x;
    var spriteBInitialPosition = spriteB.position.x;

    // Perform bounce
    var result = spriteA.bounce(spriteB);
    expect(result).to.be.true;

    // Expect displacement of spriteA out of spriteB
    expect(spriteA.position.x).to.equal(spriteAInitialPosition - expectedOverlap);
    expect(spriteB.position.x).to.equal(spriteBInitialPosition);

    // Expect all velocity to go to B
    expect(spriteA.velocity.x).to.equal(0);
    expect(spriteB.velocity.x).to.equal(3);
  });

  it('passes some momentum from a heavier moving object to a lighter stationary one in a perfectly elastic collision', function() {
    var expectedOverlap = 2;
    spriteA.position.x = spriteB.position.x - (spriteA.width - expectedOverlap);
    spriteA.velocity.x = 3;
    spriteB.velocity.x = 0;
    spriteA.mass = 2;
    spriteB.mass = 1;
    spriteA.restitution = 1;
    spriteB.restitution = 1;

    var spriteAInitialPosition = spriteA.position.x;
    var spriteBInitialPosition = spriteB.position.x;

    // Perform bounce
    var result = spriteA.bounce(spriteB);
    expect(result).to.be.true;

    // Expect displacement of spriteA out of spriteB
    expect(spriteA.position.x).to.equal(spriteAInitialPosition - expectedOverlap);
    expect(spriteB.position.x).to.equal(spriteBInitialPosition);

    expect(spriteA.velocity.x).to.equal(1);
    expect(spriteB.velocity.x).to.equal(4);
  });

  it('passes some momentum from a lighter moving object to a heavier stationary one in a perfectly elastic collision', function() {
    var expectedOverlap = 2;
    spriteA.position.x = spriteB.position.x - (spriteA.width - expectedOverlap);
    spriteA.velocity.x = 3;
    spriteB.velocity.x = 0;
    spriteA.mass = 1;
    spriteB.mass = 2;
    spriteA.restitution = 1;
    spriteB.restitution = 1;

    var spriteAInitialPosition = spriteA.position.x;
    var spriteBInitialPosition = spriteB.position.x;

    // Perform bounce
    var result = spriteA.bounce(spriteB);
    expect(result).to.be.true;

    // Expect displacement of spriteA out of spriteB
    expect(spriteA.position.x).to.equal(spriteAInitialPosition - expectedOverlap);
    expect(spriteB.position.x).to.equal(spriteBInitialPosition);

    expect(spriteA.velocity.x).to.equal(-1);
    expect(spriteB.velocity.x).to.equal(2);
  });

  it('a simply reverses direction when b is immovable and stationary in a perfectly elastic collision', function() {
    var expectedOverlap = 2;
    spriteA.position.x = spriteB.position.x - (spriteA.width - expectedOverlap);
    spriteA.velocity.x = 3;
    spriteB.velocity.x = 0;
    spriteA.mass = 1;
    spriteB.mass = 1;
    spriteA.restitution = 1;
    spriteB.restitution = 1;
    spriteB.immovable = true;

    var spriteAInitialPosition = spriteA.position.x;
    var spriteBInitialPosition = spriteB.position.x;

    // Perform bounce
    var result = spriteA.bounce(spriteB);
    expect(result).to.be.true;

    // Expect displacement of spriteA out of spriteB
    expect(spriteA.position.x).to.equal(spriteAInitialPosition - expectedOverlap);
    expect(spriteB.position.x).to.equal(spriteBInitialPosition);

    expect(spriteA.velocity.x).to.equal(-3);
    expect(spriteB.velocity.x).to.equal(0);
  });

  it('a gains speed when b is immovable and moving toward it in a perfectly elastic collision', function() {
    var expectedOverlap = 2;
    spriteA.position.x = spriteB.position.x - (spriteA.width - expectedOverlap);
    spriteA.velocity.x = 3;
    spriteB.velocity.x = -1;
    spriteA.mass = 1;
    spriteB.mass = 1;
    spriteA.restitution = 1;
    spriteB.restitution = 1;
    spriteB.immovable = true;

    var spriteAInitialPosition = spriteA.position.x;
    var spriteBInitialPosition = spriteB.position.x;

    // Perform bounce
    var result = spriteA.bounce(spriteB);
    expect(result).to.be.true;

    // Expect displacement of spriteA out of spriteB
    expect(spriteA.position.x).to.equal(spriteAInitialPosition - expectedOverlap);
    expect(spriteB.position.x).to.equal(spriteBInitialPosition);

    expect(spriteA.velocity.x).to.equal(-5);
    expect(spriteB.velocity.x).to.equal(-1);
  });

  it('a loses speed when b is immovable and moving away from it in a perfectly elastic collision', function() {
    var expectedOverlap = 2;
    spriteA.position.x = spriteB.position.x - (spriteA.width - expectedOverlap);
    spriteA.velocity.x = 3;
    spriteB.velocity.x = 1;
    spriteA.mass = 1;
    spriteB.mass = 1;
    spriteA.restitution = 1;
    spriteB.restitution = 1;
    spriteB.immovable = true;

    var spriteAInitialPosition = spriteA.position.x;
    var spriteBInitialPosition = spriteB.position.x;

    // Perform bounce
    var result = spriteA.bounce(spriteB);
    expect(result).to.be.true;

    // Expect displacement of spriteA out of spriteB
    expect(spriteA.position.x).to.equal(spriteAInitialPosition - expectedOverlap);
    expect(spriteB.position.x).to.equal(spriteBInitialPosition);

    expect(spriteA.velocity.x).to.equal(-1);
    expect(spriteB.velocity.x).to.equal(1);
  });

  it('retains all momentum together in a perfectly inelastic collision of idential masses', function() {
    var expectedOverlap = 2;
    spriteA.position.x = spriteB.position.x - (spriteA.width - expectedOverlap);
    spriteA.velocity.x = 3;
    spriteB.velocity.x = 0;
    spriteA.mass = 1;
    spriteB.mass = 1;
    spriteA.restitution = 0;
    spriteB.restitution = 0;

    var spriteAInitialPosition = spriteA.position.x;
    var spriteBInitialPosition = spriteB.position.x;

    // Perform bounce
    var result = spriteA.bounce(spriteB);
    expect(result).to.be.true;

    // Expect displacement of spriteA out of spriteB
    expect(spriteA.position.x).to.equal(spriteAInitialPosition - expectedOverlap);
    expect(spriteB.position.x).to.equal(spriteBInitialPosition);

    expect(spriteA.velocity.x).to.equal(1.5);
    expect(spriteB.velocity.x).to.equal(1.5);
  });

  it('retains all momentum together in a perfectly inelastic collision of different masses', function() {
    var expectedOverlap = 2;
    spriteA.position.x = spriteB.position.x - (spriteA.width - expectedOverlap);
    spriteA.velocity.x = 3;
    spriteB.velocity.x = 0;
    spriteA.mass = 1;
    spriteB.mass = 3;
    spriteA.restitution = 0;
    spriteB.restitution = 0;

    var spriteAInitialPosition = spriteA.position.x;
    var spriteBInitialPosition = spriteB.position.x;

    // Perform bounce
    var result = spriteA.bounce(spriteB);
    expect(result).to.be.true;

    // Expect displacement of spriteA out of spriteB
    expect(spriteA.position.x).to.equal(spriteAInitialPosition - expectedOverlap);
    expect(spriteB.position.x).to.equal(spriteBInitialPosition);

    expect(spriteA.velocity.x).to.equal(0.75);
    expect(spriteB.velocity.x).to.equal(0.75);
  });



  it('loses energy in a partially inelastic collision', function() {
    var expectedOverlap = 2;
    spriteA.position.x = spriteB.position.x - (spriteA.width - expectedOverlap);
    spriteA.velocity.x = 3;
    spriteB.velocity.x = 0;
    spriteA.mass = 1;
    spriteB.mass = 1;
    spriteA.restitution = 0.5;
    spriteB.restitution = 1;

    var spriteAInitialPosition = spriteA.position.x;
    var spriteBInitialPosition = spriteB.position.x;

    // Perform bounce
    var result = spriteA.bounce(spriteB);
    expect(result).to.be.true;

    // Expect displacement of spriteA out of spriteB
    expect(spriteA.position.x).to.equal(spriteAInitialPosition - expectedOverlap);
    expect(spriteB.position.x).to.equal(spriteBInitialPosition);

    // Expect all velocity to go to
    expect(spriteA.velocity.x).to.equal(0.75);
    expect(spriteB.velocity.x).to.equal(2.25);
  });
});
