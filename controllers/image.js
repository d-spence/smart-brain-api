const Clarifai = require('clarifai');

// Clarifai api key
const app = new Clarifai.App({
    apiKey: '2b82bc44e40e419fb4d8b8e43f3e3a72'
});

const handleApiCall = (req, res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => {
            res.json(data);
        })
        .catch(err => res.status(400).json('Api error'));
}

// Handle image route behavior
const handleImagePut = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json('Unable to get entries'));
}

module.exports = {
    handleApiCall: handleApiCall,
    handleImagePut: handleImagePut
}