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

// GET mood playlists
router.get('/mood-playlist', async(req, res) => {
  // recives mood and count from the front end
  // checks if mood was correctly recieved from the front end (helped during testing)
  console.log('Mood recieved: ', req.query.mood);
  // if mood is underfined it sends a 400 bad request error
  if(!mood){
    return res.status(400).json({error: 'Mood is required'});
  }

  try {
    // used official method of making spotify api calls as illustrated in the Spotify Web API documentation
    // https://developer.spotify.com/documentation/web-api/concepts/access-token
    let accessToken = await spotifyApi.getAccessToken();
    // uses the search playlists spotify endpoint taking in mood as its query (the mood the user selected)
    // playlist as the type and the limit (number of playlists being searched) as 5
    const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(req.query.mood)}&type=playlist&limit=5`,
    { headers: { Authorization: 'Bearer ' + accessToken}});
    // if search response is not okay it sends a 500 sever error
    if(!searchResponse.ok){
      return res.status(500).json({error: 'Spotify failed' });
    }
    const searchData = await searchResponse.json();
    playlists = searchData.playlists?.items;
    // used for testing as at first was not recieving playlists
    // displays the number of playlists recieved on the console
    console.log(`Found ${playlists.length} playlists`);
    const songs = [];
    const trackIds = new Set();
    // loop through each playlist found
    for(const playlist of playlists){
      // skips to the next playlist if the current playlist is underfined, doesn't have songs or private
      if(!playlist) continue;
      // again uses the official method of making spotify api calls as illustrated in the Spotify Web API documentation
      // this time retrieves the tracks from the playlist
      const trackResults = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
      {headers: {Authorization: 'Bearer ' + accessToken}});
      const trackData = await trackResults.json();
      // struggled with this. This is what the group had been doing with the other endpoints
      var tracks = trackData.items
        .map(item => {
          const track = item.track;
            return{
              title: track.name,
              artist: track.artists.map((a) => a.name).join('', ''),
              albumCover: (track.album.images && track.album.images[0] && track.album.images[0].url) || null,
              url: track.external_urls.spotify,
            };
        });
          // adds the songs from the tracks array to the end of the songs array
          songs = songs.concat(tracks);
          // stop searching playlists and break the loop
          if(songs.length >= req.query.count) break;
      }
    res.json(songs);
  } catch(err){
      console.error(err);
      res.status(500).send('Failed to generate mood playlist');
      }

});

module.exports = router;
