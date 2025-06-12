// Populate cards on dashboard ------------------
function populateCards(containerId, items, isSpotify = false) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  items.forEach((item) => { // <-- Added parentheses around the parameter
    const card = document.createElement('div');
    card.className = 'card';

    // Display albumn art if isSpotify = true
    if (isSpotify) {
      card.innerHTML = `
      <img src="${item.albumArt}" alt="${item.name}" style="width:100%; border-radius: 6px;">
      <p>${item.name}</p>
      <small>${item.artist || ''}</small>
    `;
    card.onclick = () => window.open(item.url, '_blank');
    } else {
      card.innerText = item;
    }
    container.appendChild(card);
  });
}

// Fetch real data using api ------------------
fetch('/api/recommendations')
  .then(res => res.json())
  .then(data => populateCards('recommendations', data, true))
  .catch(err => console.error('Failed to load recommendations:', err));

fetch('/api/my-playlists')
  .then(res => res.json())
  .then(data => populateCards('playlists', data, true))
  .catch(err => console.error('Failed to load playlists:', err));

fetch('/api/trending')
  .then(res => res.json())
  .then(data => populateCards('trending', data, true))
  .catch(err => console.error('Failed to load trending:', err));


// Basic player controls ------------------
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.innerText = message;
  toast.className = 'toast show';
  setTimeout(() => { toast.className = toast.className.replace('show', ''); }, 3000);
}

let isPlaying = false;
function togglePlay() {
  const button = document.querySelector('.controls button:nth-child(2)') || document.getElementById('play-button');
  if (!button) {
    console.error('Play button not found');
    return;
  }
  if (isPlaying) {
    isPlaying = false; // Currently playing, so pause it
    button.innerText = '▶️';
    showToast('Song paused');
  } else {
    isPlaying = true; // Currently paused, so play it
    button.innerText = '⏸️';
    showToast('Playing song');
  }
}
function prevSong() { showToast('Playing previous song'); }
function nextSong() { showToast('Playing next song'); }


// Populate cards as before (streaks) ------------------
function loadStreak() {
  const streak = localStorage.getItem('karaokeStreak') || 0;
  document.getElementById('streak-count').innerText = streak;
}

function updateStreak() {
  let streak = parseInt(localStorage.getItem('karaokeStreak') || '0', 10); // <-- Added radix parameter
  streak += 1;
  localStorage.setItem('karaokeStreak', streak);
  loadStreak();
}

// For testing, automatically increment streak every 10 seconds
setInterval(updateStreak, 10000);
loadStreak();


// Streak confettti on hover ------------------
const streakElement = document.querySelector('.streak');
const confettiContainer = document.createElement('div'); // Create the confetti container
confettiContainer.classList.add('confetti');
document.body.appendChild(confettiContainer);

// Function to generate random confetti particles
function generateConfetti(e) {
  const numberOfParticles = 30; // Number of confetti particles to create

  for (let i = 0; i < numberOfParticles; i++) {
    const confettiParticle = document.createElement('div');
    confettiParticle.classList.add('particle');

    // Set random positions and animations
    const x = Math.random() * 800 - 400; // Random X direction
    const y = Math.random() * 600 - 300; // Random Y direction
    confettiParticle.style.setProperty('--x', `${x}px`);
    confettiParticle.style.setProperty('--y', `${y}px`);

    confettiContainer.appendChild(confettiParticle);
  }
  confettiContainer.style.display = 'block'; // Show confetti container
  setTimeout(() => { confettiContainer.style.display = 'none'; }, 1500); // Hide after 1.5 seconds
}
streakElement.addEventListener('mouseover', generateConfetti); // Add hover event listener to the streak


// Light-dark theme toggle ------------------
const toggleButton = document.getElementById('theme-button');
const text = document.getElementById('theme-text');

function setTheme(mode) {
  if (mode === 'light') {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    text.textContent = 'Dark mode';
    confettiContainer.classList.add('light-mode');
  } else {
    document.body.classList.remove('light-mode');
    document.body.classList.add('dark-mode');
    text.textContent = 'Light mode';
    confettiContainer.classList.add('dark-mode');
  }
  localStorage.setItem('theme', mode);
}
toggleButton.addEventListener('click', () => {
  const isLightMode = document.body.classList.contains('light-mode');
  if (isLightMode) {
    setTheme('dark');
  } else {
    setTheme('light');
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);
});

// Set profile picture in dashboard
window.addEventListener('DOMContentLoaded', () => {
  const profilePic = document.getElementById('profile-pic');
  const localAvatar = localStorage.getItem('avatarPath');

  fetch('/api/user-info')
    .then(res => res.json())
    .then(user => {
      if (profilePic) {
        profilePic.src =
          localAvatar || user.avatarPath || '/uploads/default-avatar.png';
      }
    })
    .catch(err => {
      console.error('Failed to load user info or profile picture:', err);
      if (profilePic) {
        profilePic.src = localAvatar || '/uploads/default-avatar.png';
      }
    });
});
