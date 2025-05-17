// Placeholder: Fake song data for now
const recommendations = ["Song A", "Song B", "Song C", "Song D"];
const playlists = ["Playlist 1", "Playlist 2", "Playlist 3"];
const trending = ["Trending 1", "Trending 2", "Trending 3"];

function populateCards(containerId, items) {
  const container = document.getElementById(containerId);
  items.forEach((item) => { // <-- Added parentheses around the parameter
    const card = document.createElement('div');
    card.className = 'card';
    card.innerText = item;
    container.appendChild(card);
  });
}

// Fill dashboard
populateCards('recommendations', recommendations);
populateCards('playlists', playlists);
populateCards('trending', trending);

// Basic player controls
let isPlaying = false;

function togglePlay() {
  isPlaying = !isPlaying;
  const button = document.querySelector('.controls button:nth-child(2)');
  button.innerText = isPlaying ? '⏸️' : '▶️';
}

function prevSong() {
  const toast = document.getElementById('toast');
  toast.innerText = 'Playing previous song';
  toast.className = 'toast show';
  setTimeout(() => { toast.className = toast.className.replace('show', ''); }, 3000);
}

function nextSong() {
  const toast = document.getElementById('toast');
  toast.innerText = 'Playing next song';
  toast.className = 'toast show';
  setTimeout(() => { toast.className = toast.className.replace('show', ''); }, 3000);
}


// -- Populate cards as before --

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
// (In real app, call updateStreak() after a karaoke session ends.)
setInterval(() => {
  updateStreak();
}, 10000);

loadStreak();

// Future: Reset if user skips a day (need to store last activity date)

// Get the streak element
const streakElement = document.querySelector('.streak');

// Create the confetti container
const confettiContainer = document.createElement('div');
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

  // Show confetti container
  confettiContainer.style.display = 'block';

  // Hide after 1.5 seconds
  setTimeout(() => {
    confettiContainer.style.display = 'none';
  }, 1500);
}

// Add hover event listener to the streak
streakElement.addEventListener('mouseover', generateConfetti);


// Light-dark theme toggle
const toggleButton = document.getElementById('theme-button');
const icon = document.getElementById('theme-icon');
const text = document.getElementById('theme-text');

// Set dark/light theme
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
