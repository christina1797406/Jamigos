require('dotenv').config(); // To load private variables
var express = require('express');
var mysql = require('mysql2');
var morgan = require('morgan');
var cors = require('cors');
var path = require('path');
var bcrypt = require('bcrypt');
const { hasBrowserCrypto } = require('google-auth-library/build/src/crypto/crypto');
var app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({ // allow different ports to be used
    origin: 'http://localhost:5501',
    methods: ['GET', 'POST'],
    credential: true
}));

app.use('/user-profile', express.static(path.join(__dirname, '../user_profile')));

// Create mysql connection
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
    console.log('database connected');
});

// Route to root URL
app.get('/', (req, res) => {
    var htmlContent = '/users for list of users';
    res.send(htmlContent);
});

// Route to all users
app.get('/users', (req, res) => {
    req.pool.query('SELECT * FROM Users', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Route for adding a new user (manually)
app.post('/addUser', (req, res) => {
    const { email, username, password } = req.body;
    if (!email || !username || !password) { // Invalid input
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Hash users' password before adding to database
    bcrypt.hash(password, 10, (err, hashPassword) => {
        if (err) {
            return res.status(500).json({ error: 'Error hashing password' });
        }

        // Query to insert the new user into the database
        const sql = 'INSERT INTO Users (email, username, user_password) VALUES (?, ?, ?)';
        const values = [email, username, hashPassword];

        req.pool.query(sql, values, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ message: 'User created successfully' });
        });
    })
});

// Authenticate users from Google sign in
app.post('/auth/google', async(req, res) => {
    const { credential } = req.body;
    if (!credential) { // Invalid user
        return res.status(400).json({ error: 'Missing credential token' });
    }

    // Check Google users
    const { OAuth2Client } = require('google-auth-library');
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    // Extract user info
    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload.email
        const name = payload.name;

        // Check database if user already exist
        const checkDatabase = 'SELECT * FROM Users WHERE email = ?';
        req.pool.query(checkDatabase, [email], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (results.length > 0) { // User exists
                return res.json({ message: 'Google user logged in', user: results[0] });
            } else { // Register new user
                const insertSql = 'INSERT INTO Users (email, username, user_password) VALUES (?, ?, ?)';
                const placeholderPassword = 'GOOGLE-OAUTH'; // or empty string, not used
                req.pool.query(insertSql, [email, name, placeholderPassword], (err, result) => {

                    if (err) return res.status(500).json({ error: 'Failed to create user' });
                    res.json({ message: 'Google user created', user: { email, username: name } });
                });
              }
            });

    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Invalid Google credential token' });
    }

});

// Route to handle existing user logins
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) { // Invalid input
        return res.status(400).json({ error: 'Both email and password are required' });
    }

    // Check database if email already exists
    const checkDatabase = 'SELECT * FROM Users WHERE email = ?';
    req.pool.query(checkDatabase, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }
        // Check password using bcrypt
        let user = results[0];
        bcrypt.compare(password, user.user_password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ error: 'Could not check password' });
            }
            if (!isMatch) {
                return res.status(401).json({ error: 'Incorrect password' });
            }
            res.json({ message: 'Login successful', user: { email: user.email, username: user.username }});
        })
    })
})

app.post('/user-profile/update', function(req,res){
    const { user_id, profile_pic } = req.body;

    if(!user_id){
        return res.status(400).json({error: 'Missing user_id'});
    }

});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

