const profilePic = document.querySelector('.profile-pic-container');
const spookySound = document.getElementById('spooky-sound');

function preloadImage(src) {
  const img = new Image();
  img.src = src;
  img.onload = () => {
    if (profilePic) profilePic.style.backgroundImage = `url('${src}')`;
  };
  img.onerror = () => {
    console.error('Background image failed to load:', src);
  };
}

function playSpookySound() {
  if (!spookySound) return;
  spookySound.volume = 0.3;
  spookySound.pause();
  spookySound.currentTime = 0;
  spookySound.play().catch(err => {
    console.error('Failed to play sound:', err);
  });
}

function initProfilePicEvents() {
  if (!profilePic) return;
  profilePic.setAttribute('tabindex', '0');
  profilePic.setAttribute('aria-label', 'Profile Picture, click to play sound');
  ['click', 'touchstart', 'keydown'].forEach(evt => {
    profilePic.addEventListener(evt, e => {
      if (evt === 'touchstart') e.preventDefault();
      if (evt === 'keydown' && e.key !== 'Enter') return;
      playSpookySound();
    });
  });
}

preloadImage('assets/images/pumpkin.webp');
initProfilePicEvents();