// Placeholder: Fake song data for now
const recommendations = ["Song A", "Song B", "Song C", "Song D"];
const playlists = ["Playlist 1", "Playlist 2", "Playlist 3"];
const trending = ["Trending 1", "Trending 2", "Trending 3"];

function populateCards(containerId, items) {
  const container = document.getElementById(containerId);
  items.forEach(item => {
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
  alert('Previous song');
}

function nextSong() {
  alert('Next song');
}
