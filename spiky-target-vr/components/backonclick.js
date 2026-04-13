// move virus back to start point
AFRAME.registerComponent('backonclick', {
  schema: {
    nr: { type: 'number' }, // number of virus
  },

  init: function () {
    let el = this.el;
    let pusten = document.querySelector('#sound_pusten');
    let scene = document.querySelector('a-scene');

    el.addEventListener("click", function (event) {
      console.log("back");
      
      // stop current alongpath animation
      el.removeAttribute('alongpath');
      pusten.play();

      // increment hit counter
      hitVirus++;

      // ✅ Trigger Level 2 if threshold reached
      if (hitVirus >= 20 && level === 1) {
        console.log("Level 2 triggered!");
        level = 2; // update current level
        spawnViruses(totalVirusElements_L1 + 1, totalVirusElements_L2, minPathDuration_L2);
      }

      el.emit('back'); // move back
    });
  }
});