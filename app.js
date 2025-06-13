var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var profileRouter = require('./routes/profile-pic'); // for profile

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

require('dotenv').config();

const mysql = require('mysql2');
const morgan = require('morgan');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');
const SpotifyWebApi = require('spotify-web-api-node');
const { OAuth2Client } = require('google-auth-library');
const { getLoginUrl, exchangeCodeForToken } = require('./auth');
const spotifyClient = require('./spotifyClient'); // Spotify helper
const { getAccessToken } = require('./spotifyClient');

const PORT = process.env.PORT || 3000;

// Paste from previous database.js file (post-merge)
// -------- Middleware --------
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({ // Allow for more ports
  origin: ['http://localhost:8080', 'http://localhost:5501'],
  methods: ['GET', 'POST'],
  credentials: true,
}));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/user-profile', express.static(path.join(__dirname, '../user_profile')));

// -------- MySQL --------
var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Attach connection to request obkect
app.use(function(req, res, next) {
  req.pool = con;
  next();
});

// Connect to database
con.connect(function(err) {
  console.log(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME);
  if (err) throw err;
  console.log('Database connected');
});


// -------- Routes --------
// Root URL route
app.get('/', (req, res) => {
  res.send('/users for list of users');
});

// Users routes
app.get('/users', (req, res) => {
  req.pool.query('SELECT * FROM Users', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

// Route for adding a new user (manually)
app.post('/addUser', (req, res) => {
  const { email, username, password } = req.body;
  console.log('Signup request received:', { email, username });

  if (!email || !username || !password) return res.status(400).json({ error: 'Missing required fields' }); // Invalid input

  // Hash users' password before adding to database
  bcrypt.hash(password, 10, (err, hashPassword) => {
    if (err) return res.status(500).json({ error: 'Error hashing password' });

    // Query to insert the new user into the database
    const sql = 'INSERT INTO Users (email, username, user_password) VALUES (?, ?, ?)';
    const values = [email, username, hashPassword];

    req.pool.query(sql, values, (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'User created successfully' });
    });
  });
});

// Route to handle existing user logins
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Both email and password are required' }); // Invalid input

    // Check database if email already exists
    const checkDatabase = 'SELECT * FROM Users WHERE email = ?';
    req.pool.query(checkDatabase, [email], (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (results.length === 0) return res.status(401).json({ error: 'User not found' });

    // Check password using bcrypt
    let user = results[0];
    bcrypt.compare(password, user.user_password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: 'Could not check password' });
      if (!isMatch) return res.status(401).json({ error: 'Incorrect password' });

      res.json({ message: 'Login successful', user: { email: user.email, username: user.username } });
    });
  });
});

// Authenticate users from Google sign in
app.post('/auth/google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: 'Missing credential token' });

  // Check Google users
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  try { // Extract user info
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;

      // Check database if user already exist
      const checkDatabase = 'SELECT * FROM Users WHERE email = ?';
      req.pool.query(checkDatabase, [email], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });

      if (results.length > 0) { // User exists
        return res.json({ message: 'Google user logged in', user: results[0] });
      } else { // Register user
        const insertSql = 'INSERT INTO Users (email, username, user_password) VALUES (?, ?, ?)';
        const placeholderPassword = 'GOOGLE-OAUTH'; // or empty string, not used
        req.pool.query(insertSql, [email, name, placeholderPassword], (err, result) => {

          if (err) return res.status(500).json({ error: 'Failed to create user' });
            res.json({ message: 'Google user created', user: { email, username: name } });
          }
        );
      }
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid Google credential token' });
  }
});

////////////////

// ----- API Endpoints -----

// Recommendations
app.get('/api/recommendations', async (req, res) => {
  try {
    var data = await spotifyClient.spotifyGet('recommendations', {
      seed_genres: 'pop',
      limit: 10,
    });
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

// Featured playlists
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

// Trending tracks
app.get('/api/trending', async (req, res) => {
  try {
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

// User playlists
app.get('/api/my-playlists', async (req, res) => {
  if (!req.session.accessToken) return res.status(401).json({ error: 'Unauthorized: Not logged in with Spotify' });
  try {
    var spotify = createUserSpotifyClient(req.session);
    var data = await spotify.getUserPlaylists();
    var playlists = data.body.items.map(pl => ({
      id: pl.id,
      name: pl.name,
      albumArt: pl.images?.[0]?.url || '',
      url: pl.external_urls.spotify,
    }));
    res.json(playlists);
  } catch (error) {
    console.error('Error fetching user playlists:', error.message);
    res.status(500).json({ error: 'Failed to fetch user playlists' });
  }
});


// // ----- START New endpoints Top 5 Tracks -----
// // const token = 'BQBamgdSoB5rSKLa7JP-kNSk7qndtm-AA3_ZUI69Kn304o19DDVo-cIoiubEhWloIsaMNBKGowJu0Ck8wOUd6Wso9oRZwzA6OlhytB5jRBuboPhoWmBe8ajExD1FS9ijbbX7WL1LhWMWHJPZeRQhtdAKayzBijU9htCVsS5ZK6Qa1P8z-xIdrFDKQKUyGrR3li_vUDv-blxcF2B1TeT-_hxW9_aTyKEH-uMPX8f7PB2xUoM9Vnt2eG9B2vszPP39i339V82eZ30QYax7klSD5WFN4FOx6CR3fEABZVdTP2k90sZcVVbmPKHlDbqW9D0R';
// async function fetchWebApi(endpoint, method, body) {
//   const res = await fetch(`https://api.spotify.com/${endpoint}`, {
//     headers: {
//       Authorization: `Bearer ${getAccessToken}`, // Or req.session.accessToken
//     },
//     method,
//     body:JSON.stringify(body)
//   });
//   return await res.json();
// }

// async function getTopTracks(){
//   return (await fetchWebApi(
//     'v1/me/top/tracks?time_range=long_term&limit=5', 'GET'
//   )).items;
// }

// const topTracks = await getTopTracks();
// console.log(
//   topTracks?.map(
//     ({name, artists}) =>
//       `${name} by ${artists.map(artist => artist.name).join(', ')}`
//   )
// );
// // ----- END New endpoints Top 5 Tracks -----

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

// Spotify login route
app.get('/login', (req, res) => {
  res.redirect(getLoginUrl());
});

// Spotify OAuth callback route
app.get('/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { accessToken, refreshToken, expiresIn } = await exchangeCodeForToken(code);
    req.session.accessToken = accessToken;
    req.session.refreshToken = refreshToken;
    req.session.expiresAt = Date.now() + expiresIn * 1000;
    res.redirect('/dashboard.html'); // or redirect to dashboard
  } catch (err) {
    console.error('OAuth callback error:', err);
    res.status(500).send('Authentication failed');
  }
});

app.use('/profile-pic', profileRouter); // for profile

module.exports = app;
