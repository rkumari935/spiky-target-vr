AFRAME.registerComponent('win-lose', {
  init: function () {

    let scene = document.querySelector('a-scene');
    let gameOver = false;

    function clearAllViruses() {
      let viruses = scene.querySelectorAll('.clickable');

      for (let i = 0; i < viruses.length; i++) {
        let v = viruses[i];

        v.removeAttribute('alongpath');
        v.removeAttribute('animation__rot');

        if (v.parentNode) {
          v.parentNode.removeChild(v);
        }
      }
    }

    function showMessage(text, color) {
      let msg = document.createElement('a-entity');

      msg.setAttribute('position', '0 2 -3');
      msg.setAttribute('text', {
        value: text,
        color: color,
        width: 6,
        align: 'center'
      });

      scene.appendChild(msg);
    }

    // =========================
    // WIN
    // =========================
    this.el.addEventListener("win", function () {

      if (gameOver) return;
      gameOver = true;

      state = 2;

      clearAllViruses();

      bad_hits = 0;
      hitVirus = 0;

      showMessage("YOU WIN", "#00ff00");

      // optional music safe
      if (musicEnabled && you_did_it) you_did_it.play();

      let alogo = document.querySelector('#alogo');
      if (alogo) alogo.setAttribute('visible', 'true');

      // ✅ SHOW NAME AGAIN (ADDED)
      let playerInfo = document.querySelector('#playerInfo');
      if (playerInfo) playerInfo.setAttribute('visible', 'true');

      setTimeout(function () {

        let beer = document.createElement('a-entity');
        beer.setAttribute('position', '-1 0 -8');
        beer.setAttribute(
          'sprite-particles',
          'texture: images/duff_t5.png; velocity: 1 1 .1..2 4 0.3; acceleration: 0 -1 0..0 -2 0; seed: 2; spawnRate: 8; particleSize: 300; lifeTime: 5'
        );

        scene.appendChild(beer);

      }, 500);
    });

    // =========================
    // LOSE
    // =========================
    this.el.addEventListener("lose", function () {

      if (gameOver) return;
      gameOver = true;

      state = 2;

      clearAllViruses();

      bad_hits = 0;
      hitVirus = 0;

      showMessage("YOU LOSE", "#ff0000");

      let itsme = document.querySelector('#itsme');

      itsme.setAttribute(
        'animation__rot',
        'property: rotation; to: -90 0 0; dur: 600; delay: 100; loop: false;'
      );

      setTimeout(() => {
        if (musicEnabled && you_died) you_died.play();
      }, 2000);

      // ✅ SHOW NAME AGAIN (ADDED)
      let playerInfo = document.querySelector('#playerInfo');
      if (playerInfo) playerInfo.setAttribute('visible', 'true');

      setTimeout(function () {

        let tp = document.createElement('a-entity');
        tp.setAttribute('position', '-0.5 3 4');
        tp.setAttribute(
          'sprite-particles',
          'texture: images/klopapier128.png; velocity: 1 1 .1..2 4 0.3; acceleration: 0 -1 0..0 -2 0; seed: 2; spawnRate: 8; particleSize: 300; lifeTime: 5'
        );

        scene.appendChild(tp);

      }, 800);

    });

  }
});