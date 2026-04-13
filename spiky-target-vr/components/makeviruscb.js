// easy for Cardboard fuse controls
let level = 1;

// ✅ UPDATED LEVEL SETTINGS (BALANCED)
let totalVirusElements_L1 = 6;   // was 3 → now more but manageable
let totalVirusElements_L2 = 9;   // was 6 → more pressure

let minPathDuration_L1 = 45000;  // slightly faster than 50000
let minPathDuration_L2 = 26000;  // slightly faster than 32000

var hitVirus = 0;
var anzPoints = 9;
var maxDiff = 2;

var to_z = -0.8;
var to_y = 1.7;
var to_x = -0.15;

var lastHitTime = 0;

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// =========================
// START LEVEL (FIXED RESET BUG)
// =========================
function startLevel(lvl) {
  let scene = document.querySelector('a-scene');

  if (state !== 0 && state !== 2) return;

  hitVirus = 0;
  bad_hits = 10;

  if (lvl === 1) {
    level = 1;
    maxDiff = 1.5;
    spawnViruses(1, totalVirusElements_L1, minPathDuration_L1);

  } else if (lvl === 2) {
    level = 2;
    maxDiff = 3;
    spawnViruses(1, totalVirusElements_L2, minPathDuration_L2);
  }

  scene.emit('startgame');
}

// =========================
AFRAME.registerComponent('makevirus', {
  init: function () {}
});

// =========================
// SPAWN VIRUS
// =========================
function spawnSingleVirus(id, minPathDurationLevel) {

  let scene = document.querySelector('a-scene');
  let counthits = document.querySelector('#counthits');

  let angle = Math.random() * Math.PI * 2;
  let radius = getRandomNumber(12, 20);

  let pathStartX = Math.cos(angle) * radius;
  let pathStartZ = Math.sin(angle) * radius;
  let pathStartY = getRandomNumber(14, 24);

  let pathDuration = getRandomNumber(minPathDurationLevel, minPathDurationLevel * 1.2);
  let rotDuration = getRandomNumber(4000, 7000);

  let normalDiffOne = ((pathStartX - to_x) / anzPoints);
  let normalDiffTwo = ((pathStartY - to_y) / anzPoints);
  let normalDiffThree = ((pathStartZ - to_z) / anzPoints);

  let track = document.createElement('a-curve');
  track.setAttribute('class', `track${id}_${Date.now()}`);
  scene.append(track);

  let point1 = document.createElement('a-curve-point');
  point1.setAttribute('position', `${pathStartX} ${pathStartY} ${pathStartZ}`);
  track.append(point1);

  for (let b = 1; b < anzPoints; b++) {

    let px = pathStartX - b * normalDiffOne + getRandomNumber(-maxDiff, maxDiff);
    let py = pathStartY - b * normalDiffTwo + getRandomNumber(-maxDiff, maxDiff);
    let pz = pathStartZ - b * normalDiffThree + getRandomNumber(-maxDiff, maxDiff);

    let point2 = document.createElement('a-curve-point');
    point2.setAttribute('position', `${px.toFixed(2)} ${py.toFixed(2)} ${pz.toFixed(2)}`);
    track.append(point2);
  }

  let pointEnd = document.createElement('a-curve-point');
  pointEnd.setAttribute('position', `${to_x} ${to_y} ${to_z}`);
  track.append(pointEnd);

  let virus = document.createElement('a-entity');
  virus.setAttribute('gltf-model', '#corona');
  virus.setAttribute('class', 'clickable');
  virus.setAttribute('scale', '0.2 0.2 0.2');

  virus.setAttribute('animation__rot',
    `property: rotation; to: 360 0 0; dur: ${rotDuration}; loop: true`
  );

  virus.setAttribute('alongpath',
    `curve: .${track.getAttribute('class')}; dur: ${pathDuration}; loop: false`
  );

  let destroyed = false;
  let gazeTimer = null;

  // =========================
  // GAZE REMOVE (LEVEL 2 slightly harder)
  // =========================
  virus.addEventListener("mouseenter", () => {
    if (state !== 1) return;

    gazeTimer = setTimeout(() => {
      if (!destroyed && virus.parentNode) {

        destroyed = true;
        virus.parentNode.removeChild(virus);
        hitVirus++;

        setTimeout(() => {
          if (state === 1) spawnSingleVirus(id, minPathDurationLevel);
        }, level === 1 ? 1500 : 800); // slightly faster respawn in L2
      }
    }, level === 1 ? 250 : 170);
  });

  virus.addEventListener("mouseleave", () => {
    clearTimeout(gazeTimer);
  });

  // =========================
  // HIT PLAYER
  // =========================
  virus.addEventListener("movingended", () => {

    if (state !== 1 || destroyed) return;

    destroyed = true;

    if (bad_hits > 0) {
      bad_hits--;
      sound_bad_hit.play();
      counthits.setAttribute('text', `value: ${bad_hits}`);
    }

    if (virus.parentNode) {
      virus.parentNode.removeChild(virus);
    }

    setTimeout(() => {
      if (state === 1) spawnSingleVirus(id, minPathDurationLevel);
    }, level === 1 ? 1800 : 900);

    if (bad_hits <= 0) {
      state = 2;
      scene.emit('lose');
    }
  });

  // cleanup
  setTimeout(() => {
    if (virus.parentNode && state === 1 && !destroyed) {
      virus.parentNode.removeChild(virus);
      spawnSingleVirus(id, minPathDurationLevel);
    }
  }, pathDuration + 8000);

  scene.appendChild(virus);
}

// =========================
// SPAWN CONTROLLER
// =========================
function spawnViruses(startIndex, count, minPathDurationLevel) {

  for (let i = 0; i < count; i++) {

    setTimeout(() => {
      spawnSingleVirus(i, minPathDurationLevel);
    }, i * (level === 1 ? 1200 : 600)); // L2 slightly more aggressive
  }
}

