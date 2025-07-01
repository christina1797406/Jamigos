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
  console.log('Mood recieved: ', mood);

  if(!mood){
    return res.status(400).json({error: 'Mood is required'});
  }

  try {
    const accessToken = await spotifyApi.getAccessToken();
    console.log('AccessToken: ', accessToken);
    const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(mood)}&type=playlist&limit=5`,
    { headers: { Authorization: 'Bearer ' + accessToken}});

    if(!searchResponse.ok){
      const errorBod = await searchResponse.text();
      console.error('API failed:', searchResponse.status, errorBod);
      return res.status(500).json({error: 'Spotify failed' });

    }

    const searchData = await searchResponse.json();
    console.log('Spotify search raw response: ', JSON.stringify(searchData, null, 2));
    playlists = searchData.playlists?.items || [];
    console.log(`Found ${playlists.length} playlists`);
    const songs = [];
    const trackIds = new Set();

    for(const playlist of searchData.playlists?.items || []){
      if(!playlist) continue;
      const trackResults = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
      {headers: {Authorization: 'Bearer ' + accessToken}});
      const trackData = await trackResults.json();
      console.log(`Found ${trackData.items?.length} tracks`);
      for(const item of trackData.items || []){
        const { track } = item;
        if(track){
          if(!trackIds.has(track.id)){
            trackIds.add(track.id);
            songs.push({
            title: track.name,
            artist: track.artists.map((a) => a.name).join(", "),
            albumCover: track.album?.images?.[0].url || null,
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
