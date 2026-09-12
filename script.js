let currentPage = 0;
const pages = document.querySelectorAll('.page');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageIndicator = document.getElementById('pageIndicator');
const envelope = document.getElementById('envelope');
const passInput = document.getElementById('passInput');
const unlockBtn = document.getElementById('unlockBtn');
const lockScreen = document.getElementById('lock-screen');
const bgMusic = document.getElementById('bg-music');
const wishBtn = document.getElementById('wishBtn');
const wishMessage = document.getElementById('wishMessage');
const wishScene = document.getElementById('wishScene');
const replayConfirmation = document.getElementById('replay-confirmation');
const confirmReplay = document.getElementById('confirmReplay');
const cancelReplay = document.getElementById('cancelReplay');
const SECRET_PASSWORD = "cutiepie123";
const pageDecorations = [
  ['🌸', '🦋', '✨', '💌'],
  ['🐻', '🍓', '💖', '🌷'],
  ['🌙', '🧸', '🎀', '💭'],
  ['🌟', '🦄', '🌈', '🍀'],
  ['🐰', '🤍', '🎁', '🌼'],
  ['🫶', '🎧', '💫', '🍒'],
  ['🌷', '💌', '🫧', '🌸'],
  ['🎉', '🎂', '🎈', '❤️']
];

const cornerNames = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

pages.forEach((page, pageIndex) => {
  pageDecorations[pageIndex].forEach((decoration, decorationIndex) => {
    const corner = document.createElement('span');
    corner.className = `corner-decoration corner-${cornerNames[decorationIndex]}`;
    corner.textContent = decoration;
    corner.setAttribute('aria-hidden', 'true');
    page.append(corner);
  });
});

function updatePages(direction = 1, previousPage = null) {
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

  // Update button labels & states
  prevBtn.disabled = currentPage === 0;
  nextBtn.disabled = isFinalPage && !wishWasMade;
  if (isFinalPage) {
    nextBtn.innerText = wishWasMade ? "Replay 🎉" : "Make a wish first ✨";
  } else {
    nextBtn.innerText = "Next ➔";
  }

  // Update page numbers
  pageIndicator.innerText = `Page ${currentPage + 1} of ${pages.length}`;

  // Trigger Confetti on last page
  if (currentPage === pages.length - 1) {
    launchConfetti();
  }
}

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
  setTimeout(() => window.location.replace('about:blank'), 350);
}

function openEnvelope() {
  if (!envelope || envelope.classList.contains('opened')) {
    return;
  }

  envelope.classList.add('opened');
  setTimeout(() => passInput?.focus(), 700);
}

function handleEnvelopeKeydown(event) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openEnvelope();
  }
}

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

function playCelebrationSound() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;

  if (!AudioContext) {
    return;
  }

  const audioContext = new AudioContext();
  const startTime = audioContext.currentTime;
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
      window.speechSynthesis.speak(greeting);
    }
  }, greetingDelay);

  setTimeout(() => audioContext.close(), greetingDelay + 1800);
}

function makeWish() {
  if (!wishBtn || !wishMessage) {
    return;
  }

  wishMessage.hidden = false;
  wishScene?.classList.add('wished');
  document.body.classList.add('candle-out');
  wishBtn.disabled = true;
  wishBtn.innerText = "Wish sent 💖";
  nextBtn.disabled = false;
  nextBtn.innerText = "Replay 🎉";
  playCelebrationSound();
  launchConfetti();
}

function resetWish() {
  window.speechSynthesis?.cancel();
  document.body.classList.remove('candle-out');
  wishScene?.classList.remove('wished');

  if (wishMessage) {
    wishMessage.hidden = true;
  }

  if (wishBtn) {
    wishBtn.disabled = false;
    wishBtn.innerText = "Make a wish ✨";
  }
}

function unlockCard() {
  const input = passInput.value.trim();
  const errorMsg = document.getElementById('errorMsg');

  if (input === SECRET_PASSWORD) {
    document.body.classList.add('birthday-mode');

    if (bgMusic) {
        bgMusic.volume = 0.6;
        bgMusic.play().catch(err => console.log("Audio playback error:", err));
    }

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
      errorMsg.innerText = "incorrect password baby..wait a little ❤️";
    }
  }
}

prevBtn.addEventListener('click', () => changePage(-1));
nextBtn.addEventListener('click', handleNextClick);
envelope.addEventListener('click', openEnvelope);
envelope.addEventListener('keydown', handleEnvelopeKeydown);
unlockBtn.addEventListener('click', unlockCard);
wishBtn?.addEventListener('click', makeWish);
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

updatePages();