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
  launchConfetti();
}

function resetWish() {
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