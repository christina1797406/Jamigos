const express = require('express');
const router = express.Router();
const spotifyApi = require('../spotifyClient'); // Adjust path if needed
//const fetch = require('node-fetch');

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

//GET mood playlists

router.get('/mood-playlist', async(req, res) => {
  const { mood }= req.query;
  const count = 10;

  if(!mood){
    return res.status(400).json({error: 'Mood is required'});
  }

  try {
    const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${mood}&type=playlist&limit=5`,
    { headers: { Authorization: 'Bearer ' + accessToken}});

    const searchResult = await spotifyApi.searchPlaylists(mood);
    playlists = searchResult.playlists?.items || [];
    const songs = [];
    const trackIds = new Set();

    for(const playlist of playlists){
      const trackResults = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
      {headers: {Authorization: 'Bearer ' + accessToken}});
      const trackData = await trackResults.json();
      for(const item of trackData.items){
        const { track } = item;
        if(track){
          if(!trackIds.has(track.id)){
            songs.push({
            title: track.name,
            artist: track.artists.map((a) => a.name).join(", "),
          });
          if(songs.length >= count) break;
        }
    }
  }
   if(songs.length >= count) break;
}

 res.json(songs);
      } catch(err){
        console.error(err);
        res.status(500).send('Failed to generate mood playlist');
      }

});

module.exports = router;
