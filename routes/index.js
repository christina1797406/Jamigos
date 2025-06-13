<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> feature/user-profile
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
<<<<<<< HEAD
=======
require('dotenv').config();

const express = require('express');
const router = express.Router();
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

// Route to start the login flow
router.get('/login', (req, res) => {
  const scopes = ['user-read-private', 'user-read-email'];
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, null);
  res.redirect(authorizeURL);
});

// Callback after user logs in
router.get('/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;

    // Save the tokens for later use (e.g., session or memory)
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    res.send('Login successful! You can now use the Spotify API.');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error getting tokens:', err);
    res.status(500).send('Authentication failed');
  }
});

// GET /api/recommendations
router.get('/api/recommendations', async (req, res) => {
  try {
    const result = await spotifyApi.searchTracks('happy'); // example query
    res.json({ items: result.body.tracks.items });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).send('Failed to get recommendations');
  }
});

// GET /api/playlists
router.get('/api/playlists', async (req, res) => {
  try {
    const result = await spotifyApi.searchPlaylists('pop hits');
    res.json({ items: result.body.playlists.items });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).send('Failed to get playlists');
  }
});

// GET /api/trending
router.get('/api/trending', async (req, res) => {
  try {
    const result = await spotifyApi.getNewReleases({ limit: 10 });
    res.json({ items: result.body.albums.items });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).send('Failed to get trending albums');
  }
>>>>>>> feature/dashboard/streak
=======
>>>>>>> feature/user-profile
});

module.exports = router;
