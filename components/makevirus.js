let totalVirusElements = 8;
let hitVirus = 0; // counter for successfull hits
let anzPoints = 9;
let maxDiff = 4; // deviation from the standard path, greater = more difficult
var to_z = -0.8; // how far is the center (z-axis)
var to_y = 1.7; // my face
var to_x = -0.15;
var minPathDuration = 25000; // 30000 was slow at the beginnng

  /**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
};

AFRAME.registerComponent('makevirus', {
  schema: {
  },

  init: function () {
    var scene = document.querySelector('a-scene');
    var counthits = document.querySelector('#counthits');
    var alight = document.querySelector('#ambientlight');

    for (let a = 1; a <= totalVirusElements; a++) {
      // random path params for each virus
      let pathStartX = getRandomNumber(-16 -to_x, 16 -to_x);
      let pathStartY = getRandomNumber(15 -to_y, 24 -to_y);
      let pathStartZ = getRandomNumber(-18 -to_z, 18 -to_z);
      let pathDuration = getRandomNumber(minPathDuration, minPathDuration*1.5);
      let rotDuration = getRandomNumber(3000, 6000);
      let startdelay = a * getRandomNumber(100, 800) + 200;

      normalDiffOne = (pathStartX - to_x) / anzPoints;
      normalDiffTwo = (pathStartY - to_y) / anzPoints;
      normalDiffThree = (pathStartZ - to_z) / anzPoints;
      normalDiffOne = normalDiffOne.toFixed(2);
      normalDiffTwo = normalDiffTwo.toFixed(2);
      normalDiffThree = normalDiffThree.toFixed(2);
      // console.log('normal x' + normalDiffOne + ' y: ' + normalDiffTwo + ' z:' + normalDiffThree);

      // generate path and apply it
      let track = document.createElement('a-curve');
      track.setAttribute('class', `track${a}`);
      scene.append(track);

      // Start Point
      let point1 = document.createElement('a-curve-point');
      point1.setAttribute('position', `${pathStartX} ${pathStartY} ${pathStartZ}`);
      track.append(point1);
      // console.log('Startpoint x:' + pathStartX + ' y:' + pathStartY +' z:' + pathStartZ)

      for (let b = 1; b < anzPoints; b++) {
        if ((b%2) != 0) { // 1,3,5,7,9 to player
          var px = pathStartX - b*normalDiffOne + getRandomNumber(-maxDiff, maxDiff);
          var py = pathStartY - b*normalDiffTwo + getRandomNumber(-maxDiff, maxDiff);
          var pz = pathStartZ - b*normalDiffThree + getRandomNumber(-maxDiff, maxDiff);
        } else { // 2,4,6,8 away from player
          var px = pathStartX - (b-1.5)*normalDiffOne + getRandomNumber(-maxDiff, maxDiff);
          var py = pathStartY - (b-1.5)*normalDiffTwo + getRandomNumber(-maxDiff, maxDiff);
          var pz = pathStartZ - (b-1.5)*normalDiffThree + getRandomNumber(-maxDiff, maxDiff);
        }
        px = px.toFixed(2);
        py = py.toFixed(2);
        pz = pz.toFixed(2);
        let point2 = document.createElement('a-curve-point');
        point2.setAttribute('position', `${px} ${py} ${pz}`);
        if (b==2) {
          point2.setAttribute('class', 'trigger');
          // add sound at point 2 - to avoid 8 soundsamples at same time
          point2.addEventListener("alongpath-trigger-activated", () => {
            if (!this.el.is("withsound")) {
              this.el.addState("withsound");
              this.el.setAttribute('sound', "src: #sound_virus; loop: true; autoplay: true; poolSize: 8; maxDistance: 30; rolloffFactor: 2");
            }
          });
        }
        track.append(point2);
        // console.log('point' + b + ' x: ' + px + ' y:' + py +' z:' + pz);
      }
      // Endpoint nose
      let point9 = document.createElement('a-curve-point');
      point9.setAttribute('position', `${to_x} ${to_y} ${to_z}`);
      track.append(point9);

      let wait_startdelay = startdelay + 100000; // wait until startgame event

      let virus = document.createElement('a-entity');
      virus.setAttribute('gltf-model', '#corona');
      virus.setAttribute('id', `Virus_${a}`);
      virus.setAttribute('class', 'clickable');
      virus.setAttribute('scale', '0.2 0.2 0.2');
      virus.setAttribute('position', `${pathStartY} ${pathStartX} ${pathStartZ}`);
      virus.setAttribute('animation__rot', `property: rotation; to: 360 0 0; dur: ${rotDuration}; easing: linear; loop: true`);
      virus.setAttribute('animation__pos2', `property: position; to: ${pathStartX} ${pathStartY} ${pathStartZ}; dur:500; startEvents: back; autoplay: false;`);
      virus.setAttribute(`alongpath`, `curve: .track${a}; dur: ${pathDuration}; delay: ${wait_startdelay}; loop: true;`);

      // end of alongpath
      virus.addEventListener("movingended", () => {
        if (state == 1) {
          // console.log("moving ended:" + bad_hits);
          if (bad_hits > 0)  {
            bad_hits--;
            sound_bad_hit.play();
            counthits.setAttribute('text', `value: ${bad_hits}`);
          }
          switch (bad_hits) {
            case 8:
              counthits.setAttribute('text', `color: #f5d44e`); // yellow orange
              // Husten
              setTimeout(function() {
                husten1.play();
              }, 300);
              // alight.setAttribute('color', `${color_2}`);
              break;
            case 5:
              counthits.setAttribute('text', `color: #f53302`); // orange
              setTimeout(function() {
                husten2.play();
              }, 300);
              // alight.setAttribute('color', `${color_3}`);
              break;
            case 2:
              counthits.setAttribute('text', `color: #f5020f`); // red
              setTimeout(function() {
                husten3.play();
              }, 300);
              break;
            case 0:
              state = 2; // finish
              counthits.setAttribute('text', `value: ${bad_hits}`);
              setTimeout(function() {
                wscream.play();
              }, 200);
              scene.emit('lose');
              break;
            default:
              break;
          }
        }
      }); // movingended


      virus.addEventListener("startgame", () => {
        virus.setAttribute(`alongpath`, `delay: ${startdelay};`);
        bad_hits = 10;
      });

      virus.addEventListener("animationcomplete__pos2",  () => {
        if (state == 1) { // only when game not finished
          let fasterPathDuration = minPathDuration - 180*hitVirus;
          virus.setAttribute(`alongpath`, `curve: .track${a}; dur: ${fasterPathDuration}; delay: 200; loop: true;`);
        }
      });
      scene.append(virus);
      virus.setAttribute('backonclick', `nr: ${a}`);
    } // for all Viruses
  },
});
