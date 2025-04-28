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
