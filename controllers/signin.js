// Handle signin route behavior
const handleSignIn = (req, res, db, bcrypt) => {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
        return res.status(400).json('Incorrect form submission');
    }

    // Attempt sign in with provided user credentials
    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            // bcrypt compare password and hash values
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => {
                        res.json(user[0]);
                    })
                    .catch(err => res.status(400).json('Unable to get user'));
            } else {
                res.status(400).json('Wrong credentials');
            }
        })
        .catch(err => res.status(400).json('Wrong credentials'));
}

module.exports = {
    handleSignIn: handleSignIn
}