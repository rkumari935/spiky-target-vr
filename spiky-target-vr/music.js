let musicEnabled = true;

function toggleMusic() {
  let btn = document.querySelector('#musicBtn');

  musicEnabled = !musicEnabled;

  // =========================
  // STOP ALL CURRENT SOUNDS
  // =========================
  let allSounds = document.querySelectorAll('[sound]');

  for (let i = 0; i < allSounds.length; i++) {
    let s = allSounds[i];

    if (s.components && s.components.sound) {
      s.components.sound.stopSound();
    }
  }

  // stop howler sounds
  let allGameSounds = [
    you_did_it,
    you_died,
    husten1,
    husten2,
    husten3,
    jazzt1,
    jazzt2,
    jazzt3,
    sound_bad_hit,
    sound_fall,
    wscream,
    soundgewitter
  ];

  for (let i = 0; i < allGameSounds.length; i++) {
    let snd = allGameSounds[i];
    if (snd) snd.stop();
  }

  // =========================
  // ONLY restart background music (optional)
  // =========================
  if (musicEnabled) {
    let bg = document.querySelector('#bgmusic');
    if (bg && bg.components.sound) {
      bg.components.sound.playSound();
    }
  }

  // =========================
  // BUTTON TEXT
  // =========================
  if (musicEnabled) {
    btn.setAttribute('text', 'value: Music ON');
  } else {
    btn.setAttribute('text', 'value: Music OFF');
  }
}

