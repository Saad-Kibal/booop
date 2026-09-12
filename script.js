let currentPage = 0;
const pages = document.querySelectorAll('.page');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageIndicator = document.getElementById('pageIndicator');

function updatePages() {
  pages.forEach((page, index) => {
    if (index === currentPage) {
      page.classList.add('active');
    } else {
      page.classList.remove('active');
    }
  });

  // Update button labels & states
  prevBtn.disabled = currentPage === 0;
  if (currentPage === pages.length - 1) {
    nextBtn.innerText = "Replay 🎉";
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
  currentPage += direction;
  if (currentPage >= pages.length) {
    currentPage = 0; // Restart if replay clicked
  }
  if (currentPage < 0) {
    currentPage = 0;
  }
  updatePages();
}

function launchConfetti() {
  var duration = 3 * 1000;
  var end = Date.now() + duration;

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

// SET YOUR DESIRED PASSWORD HERE
const SECRET_PASSWORD = "cutiepie";

function unlockCard() {
  const input = document.getElementById('passInput').value.trim();
  const errorMsg = document.getElementById('errorMsg');
  const lockScreen = document.getElementById('lock-screen');
  const bgMusic = document.getElementById('bg-music');

  if (input === SECRET_PASSWORD) {
    
    if (bgMusic) {
        bgMusic.volume = 0.6;
        bgMusic.play().catch(err => console.log("Audio playback error:", err));
    }
    // Fade out and hide lock screen
    if (lockScreen) {
      lockScreen.style.transition = "opacity 0.4s ease";
      lockScreen.style.opacity = "0";
      setTimeout(() => {
        lockScreen.style.display = "none";
      }, 400);
    }
  } else {
    if (errorMsg) {
      errorMsg.innerText = "incorrect password baby..wait a little ❤️";
    }
  }
}

// Allow pressing "Enter" key on keyboard to submit password
document.getElementById('passInput')?.addEventListener('keyup', function(event) {
  if (event.key === "Enter") {
    unlockCard();
  }
});