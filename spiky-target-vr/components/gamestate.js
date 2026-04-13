var past_time = -120;
var tplaytime;
var state = 0; // 0 = waiting, 1 = running, 2 = finish

AFRAME.registerComponent('gamestate', {

  init: function () {
    var el = this.el;

    tplaytime = document.querySelector('#playtime');

    this.throttledFunction = AFRAME.utils.throttle(this.everySecond, 1000, this);

    el.addEventListener('startgame', () => {

      // ✅ FIX: prevent resetting if already running
      if (state === 1) return;

      past_time = 0;
      state = 1;

      let alogo = document.querySelector('#alogo');
      if (alogo) alogo.setAttribute('visible', 'false');

      // ✅ NEW FIX: hide player info at game start
      let playerInfo = document.querySelector('#playerInfo');
      if (playerInfo) playerInfo.setAttribute('visible', 'false');
    });
  },

  everySecond: function () {

    if (state == 1) {
      past_time++;
      tplaytime.setAttribute('text', `value: ${past_time}`);

      switch (past_time) {
        case 4:
          if (musicEnabled && jazzt1) jazzt1.play();
          break;

        case 44:
          if (musicEnabled && jazzt2) jazzt2.play();
          break;

        case 86:
          if (musicEnabled && jazzt3) jazzt3.play();
          break;

        case 130:
          state = 2;
          past_time = 130;

          let scene = document.querySelector('a-scene');
          scene.emit('win');
          break;

        default:
      }
    }
  },

  tick: function () {
    this.throttledFunction();
  }
});