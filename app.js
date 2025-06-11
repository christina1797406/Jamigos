var express = require('express');
var spotifyClient = require('./spotifyClient');
var path = require('path');
var SpotifyWebApi = require('spotify-web-api-node');
var session = require('express-session');
var { getLoginUrl, exchangeCodeForToken } = require('./auth'); // from auth.js

require('dotenv').config();

var app = express();
var PORT = process.env.PORT || 3000 || 8080;

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

// Get trending tracks
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
        // eslint-disable-next-line no-nested-ternary
        albumArt: track.album.images[0]?.url || '',
        url: track.external_urls.spotify,
      };
    });

    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trending tracks' });
  }
});

// Middleware for sessions
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Helper to create a Spotify API client with the user's token
function createUserSpotifyClient(session) {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
  });
  spotifyApi.setAccessToken(session.accessToken);
  return spotifyApi;
}

// GET /api/my-playlists
app.get('/api/my-playlists', async (req, res) => {
  if (!req.session.accessToken) {
    return res.status(401).json({ error: 'Unauthorized: Not logged in with Spotify' });
  }

  try {
    const spotify = createUserSpotifyClient(req.session);
    const data = await spotify.getUserPlaylists();

    const playlists = data.body.items.map(pl => ({
      id: pl.id,
      name: pl.name,
      albumArt: pl.images[0]?.url || '',
      url: pl.external_urls.spotify,
    }));

    res.json(playlists);
  } catch (error) {
    console.error('Error fetching user playlists:', error.message);
    res.status(500).json({ error: 'Failed to fetch user playlists' });
  }
});

// Login route
app.get('/login', (req, res) => {
  res.redirect(getLoginUrl());
});

// Callback route
app.get('/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { accessToken, refreshToken, expiresIn } = await exchangeCodeForToken(code);
    req.session.accessToken = accessToken;
    req.session.refreshToken = refreshToken;
    req.session.expiresAt = Date.now() + expiresIn * 1000;
    res.redirect('/'); // or redirect to dashboard
  } catch (err) {
    console.error('OAuth callback error:', err);
    res.status(500).send('Authentication failed');
  }
});

module.exports = app;
