// start game/animations
AFRAME.registerComponent("startgame", {
  init: function() {
    var scene = document.querySelector('a-scene');
    let el = this.el;

    el.addEventListener('click', () => {
      el.emit('startgame'); // to myself
      var els = scene.querySelectorAll('.clickable');
      for (var i = 0; i < els.length; i++) {
        // console.log("emit startgame to " + els[i]);
        els[i].emit('startgame');
      }
    });
  }
});

// color laser red when intersect entity
AFRAME.registerComponent('pointer', {
  dependencies: ['raycaster'],
	init: function()
	{
    var el = this.el;
    el.addEventListener('raycaster-intersection', function () {
      el.setAttribute("line", "color: #db1102"); // red
    });
    // switch color back
		el.addEventListener("raycaster-intersection-cleared", function()
		{
			el.setAttribute("line", "color: #6699ff");
		});
	}
});
