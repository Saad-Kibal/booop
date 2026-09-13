// PSEUDOCODE: Cache the page elements and shared state used by every interaction.
let currentPage = 0;
const pages = document.querySelectorAll('.page');
const cardContainer = document.querySelector('.card-container');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageIndicator = document.getElementById('pageIndicator');
const envelope = document.getElementById('envelope');
const envelopeLetter = document.querySelector('.envelope-letter');
const passwordCelebration = document.getElementById('password-celebration');
const passInput = document.getElementById('passInput');
const unlockBtn = document.getElementById('unlockBtn');
const lockScreen = document.getElementById('lock-screen');
const bgMusic = document.getElementById('bg-music');
const wishSound = document.getElementById('wish-sound');
const wishBtn = document.getElementById('wishBtn');
const wishMessage = document.getElementById('wishMessage');
const wishScene = document.getElementById('wishScene');
const wishGameBoard = document.getElementById('wishGameBoard');
const gameScore = document.getElementById('gameScore');
const gamePrompt = document.getElementById('gamePrompt');
const gameTapHint = document.getElementById('gameTapHint');
const gameCandles = document.querySelectorAll('.cake-candle');
const replayConfirmation = document.getElementById('replay-confirmation');
const confirmReplay = document.getElementById('confirmReplay');
const cancelReplay = document.getElementById('cancelReplay');
const countdownDays = document.getElementById('countdownDays');
const countdownHours = document.getElementById('countdownHours');
const countdownMinutes = document.getElementById('countdownMinutes');
const countdownSeconds = document.getElementById('countdownSeconds');
const countdownMilliseconds = document.getElementById('countdownMilliseconds');
const SECRET_PASSWORD = "cutiepie123";
const ADMIN_PASSWORD = "birthdaytime123";
const birthdayStart = new Date(2026, 8, 15, 0, 0, 0);
let musicPausedForFinalPage = false;
let musicFadeFrame = null;
let passwordCelebrationAudioContext = null;
let passwordCelebrationAudioTimeout = null;
let wishResumeTimeout = null;
let celebrationInProgress = false;
let gameScoreValue = 0;
const GAME_SCORE_TO_WIN = 21;

// PSEUDOCODE: Calculate the time remaining and refresh each countdown number.
function updateCountdown() {
  const remainingMilliseconds = Math.max(0, birthdayStart.getTime() - Date.now());
  const totalSeconds = Math.floor(remainingMilliseconds / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = remainingMilliseconds % 1000;

  countdownDays.textContent = days;
  countdownHours.textContent = String(hours).padStart(2, '0');
  countdownMinutes.textContent = String(minutes).padStart(2, '0');
  countdownSeconds.textContent = String(seconds).padStart(2, '0');
  countdownMilliseconds.textContent = String(milliseconds).padStart(3, '0');
}

updateCountdown();
setInterval(updateCountdown, 50);

const pageDecorations = [
  ['🌸', '🦋', '✨', '💌'],
  ['🐻', '🍓', '💖', '🌷'],
  ['🌙', '🧸', '🎀', '💭'],
  ['🌟', '🦄', '🌈', '🍀'],
  ['🐰', '🤍', '🎁', '🌼'],
  ['🫶', '🎧', '💫', '🍒'],
  ['🌷', '💌', '🫧', '🌸'],
  ['🎉', '🎂', '🎈', '❤️'],
  ['🕯️', '🍰', '✨', '🎁']
];

const cornerNames = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

// PSEUDOCODE: Add decorative corner elements to each story page once at startup.
pages.forEach((page, pageIndex) => {
  page.classList.add(`page-theme-${pageIndex}`);

  pageDecorations[pageIndex].forEach((decoration, decorationIndex) => {
    const corner = document.createElement('span');
    corner.className = `corner-decoration corner-${cornerNames[decorationIndex]}`;
    corner.textContent = decoration;
    corner.setAttribute('aria-hidden', 'true');
    page.append(corner);
  });
});

// PSEUDOCODE: Mark the current page active, animate the page turn, and sync controls/audio.
function updatePages(direction = 1, previousPage = null) {
  // PSEUDOCODE: Clear any horizontal scroll created while a page-turn animation is focused.
  if (cardContainer) {
    cardContainer.scrollLeft = 0;
  }

  pages.forEach((page, index) => {
    page.classList.remove('page-flip-in-next', 'page-flip-in-prev', 'page-flip-out-next', 'page-flip-out-prev');

    if (index === currentPage) {
      page.classList.add('active');
    } else {
      page.classList.remove('active');
    }
  });

  const currentPageElement = pages[currentPage];
  if (previousPage && currentPageElement !== previousPage) {
    previousPage.classList.add(direction > 0 ? 'page-flip-out-next' : 'page-flip-out-prev');
    currentPageElement.classList.add(direction > 0 ? 'page-flip-in-next' : 'page-flip-in-prev');

    setTimeout(() => {
      previousPage.classList.remove('page-flip-out-next', 'page-flip-out-prev');
      currentPageElement.classList.remove('page-flip-in-next', 'page-flip-in-prev');
    }, 650);
  }

  const isFinalPage = currentPage === pages.length - 1;
  const wishWasMade = wishScene?.classList.contains('wished');

  // PSEUDOCODE: Disable unavailable navigation and label the next action.
  prevBtn.disabled = currentPage === 0;
  nextBtn.disabled = isFinalPage && !wishWasMade;
  if (isFinalPage) {
    nextBtn.innerText = wishWasMade ? "Replay 🎉" : "Make a wish first ✨";
  } else {
    nextBtn.innerText = "Next ➔";
  }

  pageIndicator.innerText = `Page ${currentPage + 1} of ${pages.length}`;

  // PSEUDOCODE: Pause background music for the game and resume it elsewhere.
  if (currentPage === pages.length - 1) {
    pauseMusicForFinalPage();
  } else if (!celebrationInProgress) {
    resumeBackgroundMusic();
  }
}

// PSEUDOCODE: Move one page, wrap replay back to the beginning, then redraw the story.
function changePage(direction) {
  const previousPage = pages[currentPage];

  if (direction > 0 && currentPage === pages.length - 1) {
    resetWish();
  }

  currentPage += direction;
  if (currentPage >= pages.length) {
    currentPage = 0; // Restart if replay clicked
  }
  if (currentPage < 0) {
    currentPage = 0;
  }
  updatePages(direction, previousPage);
}

function handleNextClick() {
  if (currentPage === pages.length - 1) {
    showReplayConfirmation();
    return;
  }

  changePage(1);
}

function showReplayConfirmation() {
  if (!replayConfirmation || !wishScene?.classList.contains('wished')) {
    return;
  }

  replayConfirmation.hidden = false;
  confirmReplay?.focus();
}

function hideReplayConfirmation() {
  if (replayConfirmation) {
    replayConfirmation.hidden = true;
  }

  nextBtn.focus();
}

function closeBirthdayPage() {
  document.body.classList.add('closing-card');
  setTimeout(() => {
    window.open('', '_self');
    window.close();
  }, 350);
}

// PSEUDOCODE: Open the envelope and focus the password field after its animation.
function openEnvelope(event) {
  if (!envelope || envelope.classList.contains('opened')) {
    return;
  }

  envelope.classList.add('opened');
  event?.stopPropagation();
  setTimeout(() => passInput?.focus(), 1100);
}

// PSEUDOCODE: Accept either the birthday password or the administrator password.
function isAcceptedPassword(input) {
  return input === SECRET_PASSWORD || input === ADMIN_PASSWORD;
}

// PSEUDOCODE: Close the envelope whenever the user clicks outside its letter.
function closeEnvelope() {
  envelope?.classList.remove('opened');
}

// PSEUDOCODE: Stop any password celebration audio and release its audio context.
function stopPasswordCelebrationSound() {
  if (passwordCelebrationAudioTimeout !== null) {
    clearTimeout(passwordCelebrationAudioTimeout);
    passwordCelebrationAudioTimeout = null;
  }

  if (passwordCelebrationAudioContext) {
    passwordCelebrationAudioContext.close();
    passwordCelebrationAudioContext = null;
  }
}

// PSEUDOCODE: Build a short original melody from browser-generated tones and chimes.
function playPasswordCelebrationSound() {
  stopPasswordCelebrationSound();

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) {
    return;
  }

  const audioContext = new AudioContext();
  const masterGain = audioContext.createGain();
  const compressor = audioContext.createDynamicsCompressor();
  const startTime = audioContext.currentTime + 0.04;
  const melody = [
    [523.25, 0], [659.25, 0.2], [783.99, 0.4], [1046.5, 0.65],
    [880, 1.05], [1046.5, 1.25], [1318.5, 1.45], [1568, 1.8],
    [1318.5, 2.25], [1046.5, 2.5], [1318.5, 2.75], [1760, 3.1],
    [1568, 3.55], [1318.5, 3.8], [1046.5, 4.05], [2093, 4.45]
  ];

  passwordCelebrationAudioContext = audioContext;
  masterGain.gain.setValueAtTime(0.0001, startTime);
  masterGain.gain.exponentialRampToValueAtTime(0.32, startTime + 0.12);
  masterGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 5.8);
  compressor.threshold.value = -18;
  compressor.knee.value = 12;
  compressor.ratio.value = 4;
  compressor.attack.value = 0.003;
  compressor.release.value = 0.25;
  masterGain.connect(compressor).connect(audioContext.destination);

  const playTone = (frequency, offset, duration, type, volume) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const noteTime = startTime + offset;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, noteTime);
    gain.gain.setValueAtTime(0.0001, noteTime);
    gain.gain.exponentialRampToValueAtTime(volume, noteTime + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + duration);
    oscillator.connect(gain).connect(masterGain);
    oscillator.start(noteTime);
    oscillator.stop(noteTime + duration + 0.05);
  };

  melody.forEach(([frequency, offset], index) => {
    playTone(frequency, offset, 0.42, index % 3 === 0 ? 'triangle' : 'sine', 0.22);
    playTone(frequency / 2, offset, 0.55, 'sine', 0.06);
  });

  [0.65, 1.8, 3.1, 4.45].forEach((offset, index) => {
    playTone([1318.5, 1568, 1760, 2093][index], offset, 1.1, 'sine', 0.12);
    playTone([1568, 2093, 2349, 2637][index], offset + 0.06, 0.85, 'sine', 0.07);
  });

  audioContext.resume().catch(() => {});
  passwordCelebrationAudioTimeout = setTimeout(() => {
    audioContext.close();
    passwordCelebrationAudioContext = null;
    passwordCelebrationAudioTimeout = null;
  }, 6500);
}

// PSEUDOCODE: Color the password and trigger celebration only when the value becomes valid.
function updatePasswordColor() {
  const input = passInput.value.trim();
  const isCorrect = isAcceptedPassword(input);
  const wasCorrect = passInput.classList.contains('password-correct');

  passInput.classList.toggle('password-correct', isCorrect);
  passwordCelebration?.classList.toggle('active', isCorrect);

  if (isCorrect && !wasCorrect) {
    launchConfetti();
    playPasswordCelebrationSound();
  } else if (!isCorrect && wasCorrect) {
    stopPasswordCelebrationSound();
  }
}

function handleOutsideEnvelopeClick(event) {
  if (!envelope?.classList.contains('opened') || envelopeLetter?.contains(event.target)) {
    return;
  }

  closeEnvelope();
}

function handleEnvelopeKeydown(event) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openEnvelope(event);
  }
}

// PSEUDOCODE: Fade out background music while the final page celebration is active.
function pauseMusicForFinalPage() {
  if (!bgMusic || bgMusic.paused || musicPausedForFinalPage) {
    return;
  }

  musicPausedForFinalPage = true;
  const startingVolume = bgMusic.volume;
  const fadeStart = performance.now();
  const fadeDuration = 1200;

  const fadeOut = (currentTime) => {
    const progress = Math.min((currentTime - fadeStart) / fadeDuration, 1);
    bgMusic.volume = startingVolume * (1 - progress);

    if (progress < 1) {
      musicFadeFrame = requestAnimationFrame(fadeOut);
      return;
    }

    bgMusic.pause();
    bgMusic.volume = startingVolume;
    musicFadeFrame = null;
  };

  musicFadeFrame = requestAnimationFrame(fadeOut);
}

// PSEUDOCODE: Restore background music after leaving the final page or wish scene.
function resumeBackgroundMusic() {
  if (!bgMusic || !musicPausedForFinalPage) {
    return;
  }

  if (musicFadeFrame !== null) {
    cancelAnimationFrame(musicFadeFrame);
    musicFadeFrame = null;
  }

  musicPausedForFinalPage = false;
  bgMusic.volume = 0.3;
  bgMusic.play().catch(() => {});
}

function resumeMusicAfterWishSound() {
  if (wishResumeTimeout !== null) {
    clearTimeout(wishResumeTimeout);
  }

  wishResumeTimeout = setTimeout(() => {
    wishResumeTimeout = null;
    celebrationInProgress = false;
    resumeBackgroundMusic();
  }, 3000);
}

// PSEUDOCODE: Fire confetti from both sides for a fixed celebration window.
function launchConfetti() {
  const duration = 3 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
}

// PSEUDOCODE: Play the final-page applause and spoken birthday greeting.
function playCelebrationSound(onComplete) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;

  if (!AudioContext) {
    onComplete?.();
    return;
  }

  const audioContext = new AudioContext();
  const startTime = audioContext.currentTime;
  let celebrationFinished = false;
  const finishCelebration = () => {
    if (celebrationFinished) {
      return;
    }

    celebrationFinished = true;
    onComplete?.();
  };
  const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.1, audioContext.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);

  for (let index = 0; index < noiseData.length; index += 1) {
    noiseData[index] = Math.random() * 2 - 1;
  }

  let clapTime = startTime;
  for (let clap = 0; clap < 13; clap += 1) {
    const source = audioContext.createBufferSource();
    const filter = audioContext.createBiquadFilter();
    const pan = audioContext.createStereoPanner ? audioContext.createStereoPanner() : null;
    const gain = audioContext.createGain();
    const clapVolume = 0.2 + Math.random() * 0.16;

    source.buffer = noiseBuffer;
    filter.type = 'bandpass';
    filter.frequency.value = 1300 + Math.random() * 1600;
    filter.Q.value = 0.7 + Math.random() * 0.8;
    gain.gain.setValueAtTime(0.0001, clapTime);
    gain.gain.exponentialRampToValueAtTime(clapVolume, clapTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, clapTime + 0.085);

    if (pan) {
      pan.pan.value = -0.65 + Math.random() * 1.3;
      source.connect(filter).connect(pan).connect(gain).connect(audioContext.destination);
    } else {
      source.connect(filter).connect(gain).connect(audioContext.destination);
    }

    source.start(clapTime);
    source.stop(clapTime + 0.1);
    clapTime += 0.09 + Math.random() * 0.1;
  }

  const woo = audioContext.createOscillator();
  const wooGain = audioContext.createGain();
  const wooTime = clapTime + 0.15;

  woo.type = 'sine';
  woo.frequency.setValueAtTime(280, wooTime);
  woo.frequency.exponentialRampToValueAtTime(560, wooTime + 0.42);
  wooGain.gain.setValueAtTime(0.0001, wooTime);
  wooGain.gain.exponentialRampToValueAtTime(0.18, wooTime + 0.06);
  wooGain.gain.exponentialRampToValueAtTime(0.0001, wooTime + 0.5);
  woo.connect(wooGain).connect(audioContext.destination);
  woo.start(wooTime);
  woo.stop(wooTime + 0.52);

  const greetingDelay = (wooTime - startTime + 0.75) * 1000;
  setTimeout(() => {
    if ('speechSynthesis' in window) {
      const greeting = new SpeechSynthesisUtterance('Happy birthday!');
      greeting.rate = 0.9;
      greeting.pitch = 1.15;
      greeting.volume = 1;
      greeting.onend = finishCelebration;
      greeting.onerror = finishCelebration;
      window.speechSynthesis.speak(greeting);
    } else {
      finishCelebration();
    }
  }, greetingDelay);

  setTimeout(finishCelebration, greetingDelay + 2500);
  setTimeout(() => audioContext.close(), greetingDelay + 1800);
}

// PSEUDOCODE: Mark the wish as made, blow out the candle, and start the final celebration.
function makeWish() {
  if (!wishBtn || !wishMessage) {
    return;
  }

  wishMessage.hidden = false;
  wishScene?.classList.add('wished');
  wishScene?.classList.add('wish-complete');
  wishBtn.style.left = 'auto';
  wishBtn.style.right = '12px';
  wishBtn.style.top = '12px';
  wishBtn.setAttribute('aria-label', 'Wish sent');
  document.body.classList.add('candle-out');
  celebrationInProgress = true;
  wishBtn.disabled = true;
  wishBtn.innerText = "Wish\nsent 💖";
  nextBtn.disabled = false;
  nextBtn.innerText = "Replay 🎉";
  if (wishSound) {
    wishSound.currentTime = 0;
    wishSound.onended = () => {
      wishSound.onended = null;
      resumeMusicAfterWishSound();
    };
    wishSound.play().catch(() => {
      wishSound.onended = null;
      resumeMusicAfterWishSound();
    });
  } else {
    resumeMusicAfterWishSound();
  }
  playCelebrationSound();
  launchConfetti();
}

// PSEUDOCODE: Move the sparkle target to a new safe spot inside the game board.
function moveGameTarget() {
  const targetSize = wishBtn.offsetWidth;
  const boardWidth = wishGameBoard.clientWidth;
  const boardHeight = wishGameBoard.clientHeight;
  const horizontalPosition = Math.random() * Math.max(0, boardWidth - targetSize);
  const verticalPosition = Math.random() * Math.max(0, boardHeight - targetSize - 82);
  const hintWidth = gameTapHint.offsetWidth || 100;
  const hintCenter = Math.min(
    Math.max(horizontalPosition + targetSize / 2, hintWidth / 2 + 4),
    boardWidth - hintWidth / 2 - 4
  );

  wishBtn.style.left = `${horizontalPosition}px`;
  wishBtn.style.top = `${verticalPosition}px`;
  gameTapHint.style.left = `${hintCenter}px`;
  gameTapHint.style.top = `${verticalPosition + targetSize + 5}px`;
}

// PSEUDOCODE: Extinguish one more cake candle at each third of the challenge and darken the board.
function updateGameVisuals() {
  const progress = gameScoreValue / GAME_SCORE_TO_WIN;
  const extinguishedCandles = Math.floor(progress * gameCandles.length + 0.0001);

  gameCandles.forEach((candle, candleIndex) => {
    candle.classList.toggle('candle-off', candleIndex < extinguishedCandles);
  });
  wishGameBoard.style.setProperty('--game-darkness', (progress * 0.62).toFixed(2));
}

// PSEUDOCODE: Count a successful tap and trigger the real wish only at 21.
function collectSparkle() {
  if (gameScoreValue >= GAME_SCORE_TO_WIN || !wishGameBoard) {
    return;
  }

  gameScoreValue += 1;
  wishBtn.blur();
  if (cardContainer) {
    cardContainer.scrollLeft = 0;
  }
  gameScore.textContent = `${gameScoreValue} / ${GAME_SCORE_TO_WIN}`;
  if (gameScoreValue >= 2) {
    wishGameBoard.classList.remove('hint-active');
  }
  updateGameVisuals();
  wishGameBoard.classList.remove('target-hit');
  void wishGameBoard.offsetWidth;
  wishGameBoard.classList.add('target-hit');

  if (gameScoreValue === GAME_SCORE_TO_WIN) {
    wishBtn.disabled = true;
    gamePrompt.textContent = 'You found all 21. Make your wish! 🎉';
    makeWish();
    return;
  }

  gamePrompt.textContent = gameScoreValue >= 14
    ? 'Almost there... the birthday magic is building!'
    : 'Catch it again! The 21st sparkle is waiting...';
  moveGameTarget();
  if (cardContainer) {
    requestAnimationFrame(() => {
      cardContainer.scrollLeft = 0;
    });
  }
}

// PSEUDOCODE: Restore the game, message, audio, and controls for replay.
function resetWish() {
  window.speechSynthesis?.cancel();
  if (wishResumeTimeout !== null) {
    clearTimeout(wishResumeTimeout);
    wishResumeTimeout = null;
  }
  if (wishSound) {
    wishSound.onended = null;
    wishSound.pause();
    wishSound.currentTime = 0;
  }
  celebrationInProgress = false;
  document.body.classList.remove('candle-out');
  wishScene?.classList.remove('wished');
  wishScene?.classList.remove('wish-complete');

  if (wishMessage) {
    wishMessage.hidden = true;
  }

  if (wishBtn) {
    wishBtn.disabled = false;
    wishBtn.innerText = "🔥";
    wishBtn.setAttribute('aria-label', 'Blow out the next birthday candle');
    wishBtn.style.left = '';
    wishBtn.style.right = '';
    wishBtn.style.top = '';
  }

  gameScoreValue = 0;
  gameScore.textContent = `0 / ${GAME_SCORE_TO_WIN}`;
  gamePrompt.textContent = 'Tap the flame to blow out the first candle.';
  wishGameBoard.classList.add('hint-active');
  updateGameVisuals();
  moveGameTarget();

  resumeBackgroundMusic();
}

// PSEUDOCODE: Start the background track one quarter through once its duration is known.
function startBackgroundMusicFromMiddle() {
  if (!bgMusic) {
    return;
  }

  const setMiddlePoint = () => {
    if (Number.isFinite(bgMusic.duration) && bgMusic.duration > 0) {
      bgMusic.currentTime = bgMusic.duration / 4;
    }
  };

  if (Number.isFinite(bgMusic.duration) && bgMusic.duration > 0) {
    setMiddlePoint();
  } else {
    bgMusic.addEventListener('loadedmetadata', setMiddlePoint, { once: true });
  }

  bgMusic.volume = 0.3;
  bgMusic.play().catch(err => console.log("Audio playback error:", err));
}

// PSEUDOCODE: Validate the password, then fade the lock screen into the birthday card.
function unlockCard() {
  const input = passInput.value.trim();
  const errorMsg = document.getElementById('errorMsg');
  const isAdmin = input === ADMIN_PASSWORD;

  if (isAcceptedPassword(input)) {
    if (!isAdmin && Date.now() < birthdayStart.getTime()) {
      if (errorMsg) {
        errorMsg.innerText = "The letter opens when the countdown reaches zero..wait a little :3 ❤️";
      }
      return;
    }

    document.body.classList.add('birthday-mode');

    startBackgroundMusicFromMiddle();

    if (lockScreen) {
      lockScreen.classList.add("opening");
      setTimeout(() => {
        lockScreen.style.transition = "opacity 0.45s ease";
        lockScreen.style.opacity = "0";
      }, 800);
      setTimeout(() => {
        lockScreen.style.display = "none";
      }, 1250);
    }
  } else {
    if (errorMsg) {
      errorMsg.innerText = "incorrect password baby..check again :3 ❤️";
    }
  }
}

// PSEUDOCODE: Connect buttons, keyboard input, password effects, and replay actions.
prevBtn.addEventListener('click', () => changePage(-1));
nextBtn.addEventListener('click', handleNextClick);
envelope.addEventListener('click', openEnvelope);
envelope.addEventListener('keydown', handleEnvelopeKeydown);
document.addEventListener('click', handleOutsideEnvelopeClick);
unlockBtn.addEventListener('click', unlockCard);
passInput.addEventListener('input', updatePasswordColor);
wishBtn?.addEventListener('click', collectSparkle);
confirmReplay?.addEventListener('click', () => {
  hideReplayConfirmation();
  changePage(1);
});
cancelReplay?.addEventListener('click', closeBirthdayPage);
passInput.addEventListener('keyup', function(event) {
  if (event.key === "Enter") {
    unlockCard();
  }
});

moveGameTarget();
updateGameVisuals();
updatePages();