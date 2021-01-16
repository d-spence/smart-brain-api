const express = require('express');

const app = express();

// express middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

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
    ]
}

// ROOT
app.get('/', (req, res) => {
    res.send(db.users);
});

// SIGN IN
app.post('/signin', (req, res) => {
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