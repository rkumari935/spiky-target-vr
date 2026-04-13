// load audio tracks
AFRAME.registerComponent('play-tracks', {
  schema: {
  },
  init: function () {
    you_did_it = new Howl({
      src: ['audio/you_did_it.mp3'],
      autoplay: false,
      loop: false,
      volume: 1,
      pool: 1,
      onload: function() {
      },
      onend: function() {
        console.log('Finished 1!');
      }
    });
    you_died = new Howl({
      src: ['audio/you_died.mp3'],
      autoplay: false,
      loop: false,
      volume: 1,
      pool: 1,
    });
    soundgewitter = new Howl({
      src: ['audio/gewittersound.mp3'],
      autoplay: false,
      loop: false,
      volume: 0.7,
      pool: 1,
      onend: function() {
        console.log('Finished 1!');
      }
    });
    husten1 = new Howl({
      src: ['audio/husten1.mp3'],
      autoplay: false,
      loop: false,
      volume: 1,
      onload: function() {
      }
    });
    husten2 = new Howl({
      src: ['audio/husten2.mp3'],
      autoplay: false,
      loop: false,
      volume: 1,
      onload: function() {
      }
    });
    husten3 = new Howl({
      src: ['audio/husten3.mp3'],
      autoplay: false,
      loop: false,
      volume: 1,
      onload: function() {
      }
    });

    sound_fall = new Howl({
      src: ['audio/fall.mp3'],
      autoplay: false,
      loop: false,
      volume: 1.0,
      pool: 1,
      onload: function() {
        // console.log('loaded sound_bad_hit');
      }
    });
    sound_bad_hit = new Howl({
      src: ['audio/bad_hit.mp3'],
      autoplay: false,
      loop: false,
      volume: 1.0,
      pool: 5, // allow 5 times simultaneously
      onload: function() {
        // console.log('loaded sound_bad_hit');
      }
    });
    wscream = new Howl({
      src: ['audio/WilhelmSpaceScream.mp3'],
      autoplay: false,
      loop: false,
      volume: 1.0,
      pool: 1,
      onload: function() {
        // console.log('loaded WilhelmSpaceScream');
      }
    });
    jazzt1 = new Howl({
      src: ['audio/Jazzt1.mp3'],
      autoplay: false,
      loop: false,
      volume: 1.0,
      pool: 1,
      onload: function() {
      }
    });
    jazzt2 = new Howl({
      src: ['audio/Jazzt2.mp3'],
      autoplay: false,
      loop: false,
      volume: 1.0,
      pool: 1,
      onload: function() {
      }
    });
    jazzt3 = new Howl({
      src: ['audio/Jazzt3.mp3'],
      autoplay: false,
      loop: false,
      volume: 1.0,
      pool: 1,
      onload: function() {
      }
    })
  },
});

// avoid audio click
AFRAME.registerComponent('sound-fade', {
  schema: {
    from: {default: 0.0},
    to: {default: 1.0},
    duration: {default: 500},
  },

  init: function () {
    this.el.addEventListener('sound-loaded', ()=> {console.log('fadesound loaded')});
    if (this.el.getAttribute('sound')) {
      this.el.setAttribute('sound', 'volume', this.data.from);
      this.fadeEnded = false;
      this.diff = this.data.to - this.data.from;
    }
    else {
      this.fadeEnded = true;
    }
  },

  update: function (oldData) {
      this.endTime = undefined;
      this.fadeEnded = false;
      this.diff = this.data.to - this.data.from;
  },

  tick: function (time, delta) {
    if (this.fadeEnded) {
      return;
    }
    if (this.endTime === undefined) {
      this.endTime = time + this.data.duration;
      return;
    }

    var ease = 1 - (this.endTime - time) / this.data.duration;
    ease = Math.max(0, Math.min(1, ease * ease)); //easeQuadIn
    var vol = this.data.from + this.diff * ease;
    this.el.setAttribute('sound', 'volume', vol);
    if (ease === 1) {
      this.fadeEnded = true;
    }
  }
});
