var express = require('express');
var spotifyClient = require('./spotifyClient');
var path = require('path');
require('dotenv').config();

var app = express();
var PORT = process.env.PORT || 3000;

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'public')));

// --- API Endpoints ---

// Get recommended tracks (Example: Spotify's “Get Recommendations” API requires seed genres or tracks; here we hardcode seed_genres)
app.get('/api/recommendations', async (req, res) => {
  try {
    var data = await spotifyClient.spotifyGet('recommendations', {
      seed_genres: 'pop', // You can customize or extend this
      limit: 10,
    });

    // Map Spotify tracks to simpler objects for frontend
    var tracks = data.tracks.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      albumArt: (track.album.images && track.album.images[0] && track.album.images[0].url) || '',
      url: track.external_urls.spotify,
    }));

    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// Get featured playlists
app.get('/api/playlists', async (req, res) => {
  try {
    var data = await spotifyClient.spotifyGet('browse/featured-playlists', {
      country: 'US',
      limit: 10,
    });

    var playlists = data.playlists.items.map(pl => ({
      id: pl.id,
      name: pl.name,
      albumArt: (pl.images && pl.images[0] && pl.images[0].url) || '',
      url: pl.external_urls.spotify,
    }));

    res.json(playlists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});

// Get trending tracks (Here we use Spotify’s "Get Charts" via a popular playlist ID — can be customized)
app.get('/api/trending', async (req, res) => {
  try {
    // Example: Get tracks from Spotify’s Global Top 50 playlist
    var playlistId = '37i9dQZEVXbMDoHDwVN2tF'; // Spotify Global Top 50

    var data = await spotifyClient.spotifyGet(`playlists/${playlistId}/tracks`, {
      limit: 10,
    });

    var tracks = data.items.map(item => {
      var track = item.track;
      return {
        id: track.id,
        name: track.name,
        artist: track.artists.map(a => a.name).join(', '),
        albumArt: track.album.images[0]?.url || '',
        url: track.external_urls.spotify,
      };
    });

    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trending tracks' });
  }
});

module.exports = app;
