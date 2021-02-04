const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

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

db.select('*').from('users').then(data => {
    console.log(data);
});

// Express server app
const app = express();

// Express middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

// temp database
// const db = {
//     users: [
//         {
//             id: '1',
//             name: 'John',
//             email: 'john@gmail.com',
//             password: 'testing123',
//             entries: 0,
//             joined: new Date(),
//         },
//         {
//             id: '2',
//             name: 'Jane',
//             email: 'jane@outlook.com',
//             password: 'apples',
//             entries: 0,
//             joined: new Date(),
//         }
//     ]
// }

// ROOT
app.get('/', (req, res) => {
    res.send(db.users);
});

// SIGN IN
app.post('/signin', (req, res) => {
    // bcrypt compare password and hash values
    bcrypt.compare(req.body.password, db.users[0].password, function(err, result) {
        console.log('password hash match: ', result);
    });

    if (req.body.email === db.users[0].email &&
        req.body.password === db.users[0].password) {
            res.json(db.users[0]);
    } else {
        res.status(400).json('sign in error');
    }
});

// REGISTER
app.post('/register', (req, res) => {
    const { email, name, password } = req.body;

    // bcrypt hash password string
    const saltRounds = 10; // bcrypt cost factor
    bcrypt.hash(password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        console.log(hash);
    });

    // Insert user info into db users table
    db('users')
        .returning('*')
        .insert({
            email: email,
            name: name,
            joined: new Date()
        })
        .then(user => {
            // respond with user json data
            res.json(user[0]);
        })
        .catch(err => res.status(400).json('Unable to register'));
});

// PROFILE
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    db.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    });
    if (!found) {
        res.status(404).json('no user found with that id');
    }
});

// IMAGE
app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    db.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    });
    if (!found) {
        res.status(404).json('no user found with that id');
    }
});

// Start Server
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
