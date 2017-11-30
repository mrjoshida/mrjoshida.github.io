describe('Sprite', function() {
  var MARGIN_OF_ERROR = 0.0000001;
  var pInst;

  beforeEach(function() {
    pInst = new p5(function() {});
  });

  afterEach(function() {
    pInst.remove();
  });

  it('sets correct coordinate mode for rendering', function() {
    // Note: This test reaches into p5's internals somewhat more than usual.
    // It's designed to catch a particular rendering regression reported in
    // issue #48, where certain local constants are initialized incorrectly.
    // See https://github.com/molleindustria/p5.play/issues/48
    expect(p5.prototype.CENTER).to.not.be.undefined;
    var rectMode, ellipseMode, imageMode;

    // Monkeypatch sprite's draw method to inspect coordinate mode at draw-time.
    var sprite = pInst.createSprite();
    sprite.draw = function() {
      rectMode = pInst._renderer._rectMode;
      ellipseMode = pInst._renderer._ellipseMode;
      imageMode = pInst._renderer._imageMode;
    };
    pInst.drawSprites();

    // Check captured modes.
    expect(rectMode).to.equal(p5.prototype.CENTER);
    expect(ellipseMode).to.equal(p5.prototype.CENTER);
    expect(imageMode).to.equal(p5.prototype.CENTER);
  });

  describe('getDirection', function() {
    var sprite;

    beforeEach(function() {
      sprite = pInst.createSprite();
    });

    function checkDirectionForVelocity(v, d) {
      sprite.velocity.x = v[0];
      sprite.velocity.y = v[1];
      expect(sprite.getDirection()).to.equal(d);
    }

    it('returns zero when there is no velocity', function() {
      checkDirectionForVelocity([0, 0], 0);
    });

    it('positive or zero y velocity gives a positive direction', function() {
      checkDirectionForVelocity([-1, 0], 180);
      checkDirectionForVelocity([0, 0], 0);
      checkDirectionForVelocity([1, 0], 0);

      checkDirectionForVelocity([-1, 1], 135);
      checkDirectionForVelocity([0, 1], 90);
      checkDirectionForVelocity([1, 1], 45);
    });

    it('negative y velocity gives a negative direction', function() {
      checkDirectionForVelocity([-1, -1], -135);
      checkDirectionForVelocity([0, -1], -90);
      checkDirectionForVelocity([1, -1], -45);
    });

    it('returns degrees when p5 angleMode is RADIANS', function() {
      pInst.angleMode(p5.prototype.RADIANS);
      checkDirectionForVelocity([1, 1], 45);
      checkDirectionForVelocity([0, 1], 90);
    });

    it('returns degrees when p5 angleMode is DEGREES', function() {
      pInst.angleMode(p5.prototype.DEGREES);
      checkDirectionForVelocity([1, 1], 45);
      checkDirectionForVelocity([0, 1], 90);
    });

  });

  describe('dimension updating when animation changes', function() {
    it('animation width and height get inherited from frame', function() {
      var image = new p5.Image(100, 100, pInst);
      var frames = [
        {name: 0, frame: {x: 0, y: 0, width: 30, height: 30}}
      ];
      var sheet = new pInst.SpriteSheet(image, frames);
      var animation = new pInst.Animation(sheet);

      var sprite = pInst.createSprite(0, 0);
      sprite.addAnimation('label', animation);

      expect(sprite.width).to.equal(30);
      expect(sprite.height).to.equal(30);
    });

    it('updates the width and height property when frames are different sizes', function() {
      var image = new p5.Image(100, 100, pInst);
      var frames = [
        {name: 0, frame: {x: 0, y: 0, width: 50, height: 50}},
        {name: 1, frame: {x: 100, y: 0, width: 40, height: 60}},
        {name: 2, frame: {x: 0, y: 80, width: 70, height: 30}}
      ];
      var sheet = new pInst.SpriteSheet(image, frames);
      var animation = new pInst.Animation(sheet);

      var sprite = pInst.createSprite(0, 0);
      sprite.addAnimation('label', animation);

      expect(sprite.width).to.equal(50);
      expect(sprite.height).to.equal(50);

      // Frame changes after every 4th update because of frame delay.
      sprite.update();
      sprite.update();
      sprite.update();
      sprite.update();
      expect(sprite.width).to.equal(40);
      expect(sprite.height).to.equal(60);

      sprite.update();
      sprite.update();
      sprite.update();
      sprite.update();
      expect(sprite.width).to.equal(70);
      expect(sprite.height).to.equal(30);
    });
  });

  describe('mouse events', function() {
    var sprite;

    beforeEach(function() {
      // Create a sprite with centered at 50,50 with size 100,100.
      // Its default collider picks up anything from 1,1 to 99,99.
      sprite = pInst.createSprite(50, 50, 100, 100);
      sprite.onMouseOver = sinon.spy();
      sprite.onMouseOut = sinon.spy();
      sprite.onMousePressed = sinon.spy();
      sprite.onMouseReleased = sinon.spy();
    });

    function moveMouseTo(x, y) {
      pInst.mouseX = x;
      pInst.mouseY = y;
      sprite.update();
    }

    function moveMouseOver() {
      moveMouseTo(1, 1);
    }

    function moveMouseOut() {
      moveMouseTo(0, 0);
    }

    function pressMouse() {
      pInst.mouseIsPressed = true;
      sprite.update();
    }

    function releaseMouse() {
      pInst.mouseIsPressed = false;
      sprite.update();
    }

    it('mouseIsOver property represents whether mouse is over collider', function() {
      moveMouseTo(0, 0);
      expect(sprite.mouseIsOver).to.be.false;
      moveMouseTo(1, 1);
      expect(sprite.mouseIsOver).to.be.true;
      moveMouseTo(99, 99);
      expect(sprite.mouseIsOver).to.be.true;
      moveMouseTo(100, 100);
      expect(sprite.mouseIsOver).to.be.false;
    });

    describe('onMouseOver callback', function() {
      it('calls onMouseOver when the mouse enters the sprite collider', function() {
        moveMouseOut();
        expect(sprite.onMouseOver.called).to.be.false;
        moveMouseOver();
        expect(sprite.onMouseOver.called).to.be.true;
      });

      it('does not call onMouseOver when the mouse moves within the sprite collider', function() {
        moveMouseTo(0, 0);
        expect(sprite.onMouseOver.callCount).to.equal(0);
        moveMouseTo(1, 1);
        expect(sprite.onMouseOver.callCount).to.equal(1);
        moveMouseTo(2, 2);
        expect(sprite.onMouseOver.callCount).to.equal(1);
      });

      it('calls onMouseOver again when the mouse leaves and returns', function() {
        moveMouseOut();
        expect(sprite.onMouseOver.callCount).to.equal(0);
        moveMouseOver();
        expect(sprite.onMouseOver.callCount).to.equal(1);
        moveMouseOut();
        expect(sprite.onMouseOver.callCount).to.equal(1);
        moveMouseOver();
        expect(sprite.onMouseOver.callCount).to.equal(2);
      });
    });

    describe('onMouseOut callback', function() {
      it('calls onMouseOut when the mouse leaves the sprite collider', function() {
        moveMouseOver();
        expect(sprite.onMouseOut.called).to.be.false;
        moveMouseOut();
        expect(sprite.onMouseOut.called).to.be.true;
      });

      it('does not call onMouseOut when the mouse moves outside the sprite collider', function() {
        moveMouseTo(0, 0);
        expect(sprite.onMouseOut.called).to.be.false;
        moveMouseTo(0, 1);
        expect(sprite.onMouseOut.called).to.be.false;
      });

      it('calls onMouseOut again when the mouse returns and leaves', function() {
        moveMouseOver();
        expect(sprite.onMouseOut.callCount).to.equal(0);
        moveMouseOut();
        expect(sprite.onMouseOut.callCount).to.equal(1);
        moveMouseOver();
        expect(sprite.onMouseOut.callCount).to.equal(1);
        moveMouseOut();
        expect(sprite.onMouseOut.callCount).to.equal(2);
      });
    });

    describe('onMousePressed callback', function() {
      it('does not call onMousePressed if the mouse was not over the sprite', function() {
        expect(sprite.mouseIsOver).to.be.false;
        pressMouse();
        expect(sprite.onMousePressed.called).to.be.false;
      });

      it('calls onMousePressed if the mouse was pressed over the sprite', function() {
        moveMouseOver();
        pressMouse();
        expect(sprite.onMousePressed.called).to.be.true;
      });

      it('calls onMousePressed if the mouse was pressed outside the sprite then dragged over it', function() {
        pressMouse();
        moveMouseOver();
        expect(sprite.onMousePressed.called).to.be.true;
      });
    });

    describe('onMouseReleased callback', function() {
      it('does not call onMouseReleased if the mouse was never pressed over the sprite', function() {
        expect(sprite.mouseIsOver).to.be.false;
        pressMouse();
        releaseMouse();
        expect(sprite.onMouseReleased.called).to.be.false;
      });

      it('calls onMouseReleased if the mouse was pressed and released over the sprite', function() {
        moveMouseOver();
        pressMouse();
        releaseMouse();
        expect(sprite.onMouseReleased.called).to.be.true;
      });

      it('calls onMouseReleased if the mouse was pressed, moved over the sprite, and then released', function() {
        pressMouse();
        moveMouseOver();
        releaseMouse();
        expect(sprite.onMouseReleased.called).to.be.true;
      });

      it('does not call onMouseReleased on mouse-out if mouse is still down', function() {
        pressMouse();
        moveMouseOver();
        moveMouseOut();
        expect(sprite.onMouseReleased.called).to.be.false;
      });

      it('does not call onMouseReleased on release if mouse has left sprite', function() {
        moveMouseOver();
        pressMouse();
        moveMouseOut();
        releaseMouse();
        expect(sprite.onMouseReleased.called).to.be.false;
      });
    });
  });

  describe('setCollider()', function() {
    var sprite;

    beforeEach(function() {
      // Position: (10, 20), Size: (30, 40)
      sprite = pInst.createSprite(10, 20, 30, 40);
    });

    it('a newly-created sprite has no collider', function() {
      expect(sprite.collider).to.be.undefined;
    });

    it('throws if first argument is not a valid type', function() {
      // Also throws if undefined
      expect(function() {
        sprite.setCollider('notAType');
      }).to.throw(TypeError, 'setCollider expects the first argument to be one of "point", "circle", "rectangle", "aabb" or "obb"');

      // Also throws if undefined
      expect(function() {
        sprite.setCollider();
      }).to.throw(TypeError, 'setCollider expects the first argument to be one of "point", "circle", "rectangle", "aabb" or "obb"');

      // Note that it's not case-sensitive
      expect(function() {
        sprite.setCollider('CIRCLE');
      }).not.to.throw();
    });

    describe('"point"', function() {
      it('can construct a collider with default offset', function() {
        sprite.setCollider('point');
        expect(sprite.collider).to.be.an.instanceOf(p5.PointCollider);
        expect(sprite.collider.center.equals(sprite.position)).to.be.true;
      });

      it('can construct a collider with custom offset', function() {
        sprite.setCollider('point', 2, 3);
        expect(sprite.collider).to.be.an.instanceOf(p5.PointCollider);
        expect(sprite.collider.center.x).to.eq(sprite.position.x + 2);
        expect(sprite.collider.center.y).to.eq(sprite.position.y + 3);
        expect(sprite.collider.offset.x).to.eq(2);
        expect(sprite.collider.offset.y).to.eq(3);
      });

      it('stores unscaled custom offset', function() {
        sprite.scale = 2;
        sprite.setCollider('point', 4, 6);
        expect(sprite.collider).to.be.an.instanceOf(p5.PointCollider);
        expect(sprite.collider.center.x).to.eq(sprite.position.x + 8);
        expect(sprite.collider.center.y).to.eq(sprite.position.y + 12);
        expect(sprite.collider.offset.x).to.eq(4);
        expect(sprite.collider.offset.y).to.eq(6);
      });

      it('stores unrotated custom offset', function() {
        sprite.rotation = 90;
        sprite.setCollider('point', 2, 3);
        expect(sprite.collider).to.be.an.instanceOf(p5.PointCollider);
        expect(sprite.collider.center.x).to.eq(sprite.position.x - 3);
        expect(sprite.collider.center.y).to.eq(sprite.position.y + 2);
        expect(sprite.collider.offset.x).to.eq(2);
        expect(sprite.collider.offset.y).to.eq(3);
      });

      it('stores unrotated and unscaled custom offset if sprite was already rotated and scaled', function() {
        sprite.scale = 2;
        sprite.rotation = 90;
        sprite.setCollider('point', 2, 3);
        expect(sprite.collider).to.be.an.instanceOf(p5.PointCollider);
        expect(sprite.collider.center.x).to.eq(sprite.position.x - 6);
        expect(sprite.collider.center.y).to.eq(sprite.position.y + 4);
        expect(sprite.collider.offset.x).to.eq(2);
        expect(sprite.collider.offset.y).to.eq(3);
      });

      it('throws if creating a point collider with 2 or 4+ params', function() {
        // setCollider('point') is okay

        expect(function() {
          sprite.setCollider('point', 2);
        }).to.throw(TypeError);

        // setCollider('point', offsetX, offsetY) is okay

        expect(function() {
          sprite.setCollider('point', 1, 2, 3);
        }).to.throw(TypeError);

        expect(function() {
          sprite.setCollider('point', 1, 2, 3, 4);
        }).to.throw(TypeError);
      });
    });

    describe('"circle"', function() {
      it('can construct collider with default radius and offset', function() {
        sprite.setCollider('circle');
        expect(sprite.collider).to.be.an.instanceOf(p5.CircleCollider);

        // Center should match sprite position
        expect(sprite.collider.center.equals(sprite.position)).to.be.true;

        // Radius should be half of sprite's larger dimension.
        expect(sprite.height).to.be.greaterThan(sprite.width);
        expect(sprite.collider.radius).to.eq(sprite.height / 2);
      });

      it('can construct a collider with default radius and custom offset', function() {
        sprite.setCollider('circle', 2, 3);
        expect(sprite.collider).to.be.an.instanceOf(p5.CircleCollider);

        // Center should be sprite position + offset
        expect(sprite.collider.center.x).to.eq(sprite.position.x + 2);
        expect(sprite.collider.center.y).to.eq(sprite.position.y + 3);

        // Radius should be half of sprite's larger dimension.
        expect(sprite.height).to.be.greaterThan(sprite.width);
        expect(sprite.collider.radius).to.eq(sprite.height / 2);
      });

      it('can construct a collider with custom radius and offset', function() {
        sprite.setCollider('circle', 2, 3, 4);
        expect(sprite.collider).to.be.an.instanceOf(p5.CircleCollider);

        // Center should be sprite position + offset
        expect(sprite.collider.center.x).to.eq(sprite.position.x + 2);
        expect(sprite.collider.center.y).to.eq(sprite.position.y + 3);

        // Radius should be as given
        expect(sprite.collider.radius).to.be.closeTo(4, MARGIN_OF_ERROR);
      });

      it('when created from a scaled sprite, has correct scaled radius', function() {
        sprite.scale = 0.25;
        sprite.setCollider('circle');
        // collider.radius is unscaled
        expect(sprite.collider.radius).to.eq(sprite.height / 2);
        // collider radius on axis will be in world-space though, and scaled.
        expect(sprite.collider._getRadiusOnAxis()).to.eq(sprite.height / 8);

        // Just changing the sprite scale is not enough to update the collider...
        // though it'd be fine if this changed in the future.
        sprite.scale = 0.5;
        expect(sprite.collider._getRadiusOnAxis()).to.eq(sprite.height / 8);

        // Right now, an update() call is required for a new sprite scale to
        // get picked up.
        sprite.update();
        expect(sprite.collider._getRadiusOnAxis()).to.eq(sprite.height / 4);
      });

      it('throws if creating a circle collider with 2 or 5+ params', function() {
        // setCollider('circle') is fine

        expect(function() {
          sprite.setCollider('circle', 1);
        }).to.throw(TypeError);

        // setCollider('circle', offsetX, offsetY) is fine


        // setCollider('circle', offsetX, offsetY, radius) is fine

        expect(function() {
          sprite.setCollider('circle', 1, 2, 3, 4);
        }).to.throw(TypeError);
        expect(function() {
          sprite.setCollider('circle', 1, 2, 3, 4, 5);
        }).to.throw(TypeError);
      });
    });

    describe('"aabb"', function() {
      it('can construct a collider with default dimensions and offset', function() {
        sprite.setCollider('aabb');
        expect(sprite.collider).to.be.an.instanceOf(p5.AxisAlignedBoundingBoxCollider);

        // Center should match sprite position
        expect(sprite.collider.center.equals(sprite.position)).to.be.true;

        // Width and height should match sprite dimensions
        expect(sprite.collider.width).to.eq(sprite.width);
        expect(sprite.collider.height).to.eq(sprite.height);
      });

      it('scaling sprite without animation does not affect default collider size', function() {
        sprite.scale = 0.25;
        sprite.setCollider('aabb');
        expect(sprite.collider.width).to.eq(sprite.width);
        expect(sprite.collider.height).to.eq(sprite.height);
      });

      it('can construct a collider with explicit dimensions and offset', function() {
        sprite.setCollider('aabb', 1, 2, 3, 4);
        expect(sprite.collider).to.be.an.instanceOf(p5.AxisAlignedBoundingBoxCollider);
        expect(sprite.collider.center.x).to.equal(sprite.position.x + 1);
        expect(sprite.collider.center.y).to.equal(sprite.position.y + 2);
        expect(sprite.collider.width).to.eq(3);
        expect(sprite.collider.height).to.eq(4);
        expect(sprite.collider.offset).to.be.an.instanceOf(p5.Vector);
        expect(sprite.collider.offset.x).to.eq(1);
        expect(sprite.collider.offset.y).to.eq(2);
      });

      it('throws if creating a collider with 2, 4, or 6+ params', function() {
        // setCollider('rectangle') is fine

        expect(function() {
          sprite.setCollider('aabb', 1);
        }).to.throw(TypeError);

        // setCollider('aabb', offsetX, offsetY) is fine

        expect(function() {
          sprite.setCollider('aabb', 1, 2, 3);
        }).to.throw(TypeError);

        // setCollider('aabb', offsetX, offsetY, width, height) is fine.

        expect(function() {
          sprite.setCollider('aabb', 1, 2, 3, 4, 5);
        }).to.throw(TypeError);

        expect(function() {
          sprite.setCollider('aabb', 1, 2, 3, 4, 5, 6);
        }).to.throw(TypeError);
      });
    });

    describe('"obb"', function() {
      it('can construct a collider with default offset, dimensions, and rotation', function() {
        sprite.setCollider('obb');
        expect(sprite.collider).to.be.an.instanceOf(p5.OrientedBoundingBoxCollider);

        // Center should match sprite position
        expect(sprite.collider.center.equals(sprite.position)).to.be.true;

        // Width and height should match sprite dimensions
        expect(sprite.collider.width).to.eq(sprite.width);
        expect(sprite.collider.height).to.eq(sprite.height);

        // Rotation should match sprite rotation
        expect(sprite.collider.rotation).to.eq(p5.prototype.radians(sprite.rotation));
      });

      it('can construct a collider with custom offset, default dimensions and rotation', function() {
        sprite.setCollider('obb', 2, 3);
        expect(sprite.collider).to.be.an.instanceOf(p5.OrientedBoundingBoxCollider);

        // Center should be sprite position + offset
        expect(sprite.collider.center.x).to.eq(sprite.position.x + 2);
        expect(sprite.collider.center.y).to.eq(sprite.position.y + 3);

        // Width and height should match sprite dimensions
        expect(sprite.collider.width).to.eq(sprite.width);
        expect(sprite.collider.height).to.eq(sprite.height);

        // Rotation should match sprite rotation
        expect(sprite.collider.rotation).to.eq(p5.prototype.radians(sprite.rotation));
      });

      it('can construct a collider with custom offset and dimensions, default rotation', function() {
        sprite.setCollider('obb', 2, 3, 4, 5);
        expect(sprite.collider).to.be.an.instanceOf(p5.OrientedBoundingBoxCollider);

        // Center should be sprite position + offset
        expect(sprite.collider.center.x).to.eq(sprite.position.x + 2);
        expect(sprite.collider.center.y).to.eq(sprite.position.y + 3);

        // Width and height should match sprite dimensions
        expect(sprite.collider.width).to.eq(4);
        expect(sprite.collider.height).to.eq(5);

        // Rotation should match sprite rotation
        expect(sprite.collider.rotation).to.eq(p5.prototype.radians(sprite.rotation));
      });
    });

    describe('"rectangle"', function() {
      it('is an alias to OBB', function() {
        sprite.setCollider('rectangle');
        expect(sprite.collider).to.be.an.instanceOf(p5.OrientedBoundingBoxCollider);
      });
    });
  });


  describe('friction', function() {
    var sprite;

    beforeEach(function() {
      sprite = pInst.createSprite();
    });

    it('has no effect on update() when set to 0', function() {
      sprite.velocity.x = 1;
      sprite.velocity.y = 1;
      sprite.friction = 0;
      sprite.update();
      expect(sprite.velocity.x).to.equal(1);
      expect(sprite.velocity.y).to.equal(1);
    });

    it('reduces velocity to zero on update() when set to 1', function() {
      sprite.velocity.x = 1;
      sprite.velocity.y = 1;
      sprite.friction = 1;
      sprite.update();
      expect(sprite.velocity.x).to.equal(0);
      expect(sprite.velocity.y).to.equal(0);
    });

    describe('axis-aligned', function() {
      beforeEach(function() {
        sprite.velocity.x = 16;
      });

      it('cuts velocity in half each update when set to 0.5', function() {
        sprite.friction = 0.5;
        expect(sprite.velocity.x).to.equal(16);
        sprite.update();
        expect(sprite.velocity.x).to.equal(8);
        sprite.update();
        expect(sprite.velocity.x).to.equal(4);
        sprite.update();
        expect(sprite.velocity.x).to.equal(2);
      });

      it('cuts velocity to one-quarter each update when set to 0.75', function() {
        sprite.friction = 0.75;
        expect(sprite.velocity.x).to.equal(16);
        sprite.update();
        expect(sprite.velocity.x).to.equal(4);
        sprite.update();
        expect(sprite.velocity.x).to.equal(1);
        sprite.update();
        expect(sprite.velocity.x).to.equal(0.25);
      });
    });

    describe('not axis-aligned', function() {
      beforeEach(function() {
        sprite.velocity.x = 3 * 16;
        sprite.velocity.y = 4 * 16;
      });

      it('cuts velocity in half each update when set to 0.5', function() {
        sprite.friction = 0.5;
        expect(sprite.velocity.x).to.equal(3 * 16);
        expect(sprite.velocity.y).to.equal(4 * 16);
        expect(sprite.velocity.mag()).to.equal(5 * 16);
        sprite.update();
        expect(sprite.velocity.x).to.equal(3 * 8);
        expect(sprite.velocity.y).to.equal(4 * 8);
        expect(sprite.velocity.mag()).to.equal(5 * 8);
        sprite.update();
        expect(sprite.velocity.x).to.equal(3 * 4);
        expect(sprite.velocity.y).to.equal(4 * 4);
        expect(sprite.velocity.mag()).to.equal(5 * 4);
        sprite.update();
        expect(sprite.velocity.x).to.equal(3 * 2);
        expect(sprite.velocity.y).to.equal(4 * 2);
        expect(sprite.velocity.mag()).to.equal(5 * 2);
      });

      it('cuts velocity to one-quarter each update when set to 0.75', function() {
        sprite.friction = 0.75;
        expect(sprite.velocity.x).to.equal(3 * 16);
        expect(sprite.velocity.y).to.equal(4 * 16);
        expect(sprite.velocity.mag()).to.equal(5 * 16);
        sprite.update();
        expect(sprite.velocity.x).to.equal(3 * 4);
        expect(sprite.velocity.y).to.equal(4 * 4);
        expect(sprite.velocity.mag()).to.equal(5 * 4);
        sprite.update();
        expect(sprite.velocity.x).to.equal(3 * 1);
        expect(sprite.velocity.y).to.equal(4 * 1);
        expect(sprite.velocity.mag()).to.equal(5 * 1);
        sprite.update();
        expect(sprite.velocity.x).to.equal(3 * 0.25);
        expect(sprite.velocity.y).to.equal(4 * 0.25);
        expect(sprite.velocity.mag()).to.equal(5 * 0.25);
      });
    });
  });
});
