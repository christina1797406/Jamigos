var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* User profile page. */
/* Load user data dynamically (mock data for now) */
const userName = 'John Doe';
const userEmail = 'john.doe@email.com';
const playlists = [
    { name: 'Rock Classics', image: 'playlist1.jpg' },
    { name: 'Top Hits', image: 'playlist2.jpg' },
    { name: 'Chill Vibes', image: 'playlist3.jpg' },
];

/* Set user profile data */
document.getElementById('user-name').innerText = userName;
document.getElementById('user-email').innerText = userEmail;

/* Render playlists */
const playlistsContainer = document.getElementById('playlists');
playlists.forEach(playlist => {
    const card = document.createElement('div');
    card.className = 'playlist-card';
    card.innerHTML = `
        <img src="${playlist.image}" alt="${playlist.name}">
        <p>${playlist.name}</p>
    `;
    playlistsContainer.appendChild(card);
});

/* Handle profile picture change */
document.getElementById('upload-img').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profile-img').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

/* Edit profile button */
function editProfile() {
    alert("Edit profile functionality will be here.");
}


module.exports = router;
