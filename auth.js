const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

function getLoginUrl() {
  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',
    'user-modify-playback-state',
    'playlist-read-private',
    'playlist-modify-public',
    'playlist-modify-private'
  ];
  return spotifyApi.createAuthorizeURL(scopes, 'jamigos');
}

async function exchangeCodeForToken(code) {
  const data = await spotifyApi.authorizationCodeGrant(code);
  return {
    accessToken: data.body['access_token'],
    refreshToken: data.body['refresh_token'],
    expiresIn: data.body['expires_in'],
  };
}

module.exports = { getLoginUrl, exchangeCodeForToken };