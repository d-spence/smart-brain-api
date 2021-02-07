const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

// Import controllers for routes
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// Connect to database
const db = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        user : 'postgres',
        password : 'admin',
        database : 'smart-brain'
    }
});

// Express server app
const app = express();

// Express middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

//================================== ROUTES ====================================
app.get('/', (req, res) => { res.send('Success') });
app.post('/signin', (req, res) => { signin.handleSignIn(req, res, db, bcrypt) });
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });
app.put('/image', (req, res) => { image.handleImagePut(req, res, db) });
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });

// Get port from env variable
const PORT = process.env.PORT;
if (PORT == null || PORT == "") {
    PORT = 3001; // default if no port set
}

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
