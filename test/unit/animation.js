describe('Animation', function() {
  var pInst;

  beforeEach(function() {
    pInst = new p5(function() {});
  });

  afterEach(function() {
    pInst.remove();
  });

  describe('goToFrame()', function() {
    var animation;

    beforeEach(function() {
      animation = createTestAnimation(10); // with 10 frames
      animation.frameDelay = 1; // One update() call = one frame
    });

    it('plays a paused animation when target != current', function() {
      var start = 2;
      for (var target = 0; target < 5; target++) {
        if (target !== start) {
          animation.changeFrame(start);
          animation.stop();
          expect(animation.playing).to.be.false;

          animation.goToFrame(target);
          expect(animation.playing).to.be.true;
        }
      }
    });

    it('does not play a paused animation when target == current', function() {
      for (var startAndTarget = 0; startAndTarget < 5; startAndTarget++) {
        animation.changeFrame(startAndTarget);
        animation.stop();
        expect(animation.playing).to.be.false;

        animation.goToFrame(startAndTarget);
        expect(animation.playing).to.be.false;
      }
    });

    it('never pauses a playing animation immediately', function() {
      var start = 2;
      for (var target = 0; target < 5; target++) {
        animation.changeFrame(start);
        animation.play();
        expect(animation.playing).to.be.true;

        animation.goToFrame(target);
        expect(animation.playing).to.be.true;
      }
    });

    it('plays the animation forward to the target frame when target > current', function() {
      animation.changeFrame(1);
      animation.goToFrame(4);

      // Verify state on each frame
      expect(animation.getFrame()).to.equal(1);

      animation.update();
      expect(animation.getFrame()).to.equal(2);

      animation.update();
      expect(animation.getFrame()).to.equal(3);

      animation.update();
      expect(animation.getFrame()).to.equal(4);

      // Note the animation stops at the target frame.
      animation.update();
      expect(animation.getFrame()).to.equal(4);
    });

    it('plays the animation backward to the target frame when target < current', function() {
      animation.changeFrame(5);
      animation.goToFrame(2);

      // Verify state on each frame
      expect(animation.getFrame()).to.equal(5);

      animation.update();
      expect(animation.getFrame()).to.equal(4);

      animation.update();
      expect(animation.getFrame()).to.equal(3);

      animation.update();
      expect(animation.getFrame()).to.equal(2);

      // Note the animation stops at the target frame.
      animation.update();
      expect(animation.getFrame()).to.equal(2);
    });

    it('pauses the frame after it reaches the target frame', function() {
      // When going forward
      animation.changeFrame(5);
      animation.goToFrame(7);
      expect(animation.playing).to.be.true;

      animation.update();
      animation.update();
      expect(animation.getFrame()).to.equal(7);
      expect(animation.playing).to.be.true;

      animation.update();
      expect(animation.getFrame()).to.equal(7);
      expect(animation.playing).to.be.false;

      // When going backward
      animation.changeFrame(4);
      animation.goToFrame(2);
      expect(animation.playing).to.be.true;

      animation.update();
      animation.update();
      expect(animation.getFrame()).to.equal(2);
      expect(animation.playing).to.be.true;

      animation.update();
      expect(animation.getFrame()).to.equal(2);
      expect(animation.playing).to.be.false;
    });

    it('pauses on the next frame when target == current', function() {
      animation.changeFrame(5);
      animation.goToFrame(5);
      expect(animation.playing).to.be.true;

      animation.update();
      expect(animation.playing).to.be.false;
    });

    describe('when target frame is out of bounds', function() {
      it('does not affect play behavior', function() {
        // Play forwards
        animation.changeFrame(5);
        animation.play();
        expect(animation.getFrame()).to.equal(5);

        // Verify playing forwards
        animation.update();
        expect(animation.getFrame()).to.equal(6);

        // Try to go to a negative frame.
        // Unless ignored, we'd expect the animation to start going backwards
        animation.goToFrame(-1);
        animation.update();
        expect(animation.getFrame()).to.equal(7);

        // Play backwards (correctly this time)
        animation.goToFrame(0);
        animation.update();
        expect(animation.getFrame()).to.equal(6);

        // Try going to a positive frame out of bounds
        // Unless ignored, we'd expect the animation to run forward again
        animation.goToFrame(animation.images.length);
        animation.update();
        expect(animation.getFrame()).to.equal(5);
      });

      it('does not affect play state', function() {
        animation.stop();
        expect(animation.playing).to.be.false;

        animation.goToFrame(-1);
        expect(animation.playing).to.be.false;

        animation.goToFrame(animation.images.length);
        expect(animation.playing).to.be.false;
      });
    });
  });

  describe('playing', function() {
    it('is false when done playing a non-looping animation', function() {
      var animation = createTestAnimation(3); // with 3 frames
      animation.frameDelay = 1;
      animation.looping = false;
      animation.play();
      expect(animation.getFrame()).to.equal(0);
      expect(animation.playing).to.equal(true);
      animation.update();
      expect(animation.getFrame()).to.equal(1);
      expect(animation.playing).to.equal(true);
      animation.update();
      expect(animation.getFrame()).to.equal(2);
      expect(animation.playing).to.equal(true);

      //Out of frames to increment
      animation.update();
      expect(animation.getFrame()).to.equal(2);
      expect(animation.playing).to.equal(false);
    });
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
      frames.push({name: i, frame: {x: 0, y: 0, width: 50, height: 50}});
    }
    var sheet = new pInst.SpriteSheet(image, frames);
    return new pInst.Animation(sheet);
  }
});

