const express = require('express');
const bcrypt = require('bcrypt');

const app = express();

// express middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

const saltRounds = 10; // bcrypt salt rounds

// temp database
const db = {
    users: [
        {
            id: '1',
            name: 'John',
            email: 'john@gmail.com',
            password: 'testing123',
            entries: 0,
            joined: new Date(),
        },
        {
            id: '2',
            name: 'Jane',
            email: 'jane@outlook.com',
            password: 'apples',
            entries: 0,
            joined: new Date(),
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com',
        }
    ]
}

// ROOT
app.get('/', (req, res) => {
    res.send(db.users);
});

// SIGN IN
app.post('/signin', (req, res) => {
    // bcrypt compare password and hash values
    bcrypt.compare("superstar", '$2b$10$Mh.E4bNY/DYfVLWr8VF/iOmpO1zk1QK17AoYGwW04cn4q1.s75602', function(err, result) {
        console.log('first guess', result);
    });

    if (req.body.email === db.users[0].email &&
        req.body.password === db.users[0].password) {
            res.json('sign in successful');
    } else {
        res.status(400).json('sign in error');
    }
});

// REGISTER
app.post('/register', (req, res) => {
    const { email, name, password } = req.body;

    // bcrypt hash password string
    bcrypt.hash(password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        console.log(hash);
    });

    db.users.push({
        id: '3',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date(),
    });
    res.json(db.users[db.users.length-1]);
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
app.post('/image', (req, res) => {
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

app.listen(3000, () => {
    console.log("App is running on port 3000");
});


/*
ROUTES/END POINTS
/ --> res = getting root /
/signin --> POST = success/fail
/register --> POST = user (obj)
/profile/:userid --> GET = user (obj)
/image --> PUT --> user (obj) count var

*/