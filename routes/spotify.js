const express = require('express');
const router = express.Router();
const spotifyApi = require('../spotifyClient'); // Adjust path if needed

// Example: Get artist albums (Taylor Swift)
router.get('/api/artist-albums', async (req, res) => {
  try {
    const data = await spotifyApi.getArtistAlbums('06HL4z0CvFAxyc27GXpf02', { limit: 10 });
    res.json(data.body.items);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).send('Failed to fetch artist albums');
  }
});

// Search playlists with keyword "mood"
router.get('/api/playlist-search', async (req, res) => {
  try {
    const data = await spotifyApi.searchPlaylists('mood');
    res.json(data.body.playlists.items);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).send('Failed to fetch playlists');
  }
});

// Get trending tracks (e.g., "Top 50 Global")
router.get('/api/trending-tracks', async (req, res) => {
  try {
    const data = await spotifyApi.searchTracks('Top 50 Global');
    res.json(data.body.tracks.items);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).send('Failed to fetch trending tracks');
  }
});

module.exports = router;
