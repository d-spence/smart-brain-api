// Handle register route behavior
const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;

    // Validate request
    if (!email || !name || !password) {
        return res.status(400).json('Incorrect form submission');
    }

    // bcrypt hash password string
    const saltRounds = 10; // bcrypt cost factor
    const hash = bcrypt.hashSync(password, saltRounds);

    // Create a transaction (2 actions)
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            // Insert user info into db users table
            return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0],
                    name: name,
                    joined: new Date()
                })
                .then(user => {
                    // respond with user json data
                    res.json(user[0]);
                })
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch(err => res.status(400).json('Unable to register'));
}

module.exports = {
    handleRegister: handleRegister
}