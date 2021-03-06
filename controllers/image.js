const Clarifai = require('clarifai')
const {CLARIFAI_KEY} = require('../config')

const app = new Clarifai.App({
    apiKey: CLARIFAI_KEY
  });

  const handleApiCall = (req, res) => {
    app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('unable to connect'))
  }

  
const handleImage = (db) => (req,res) =>{
    const { id } = req.body;
    db('users').where('id','=',id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.json(entries[0]))
    .catch(err => res.status(400).json('UNABLE TO GET ENTRIES'))
}

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
};