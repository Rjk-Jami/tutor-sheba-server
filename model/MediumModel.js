const mongoose = require('mongoose');

const mediumSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

const MediumModel = mongoose.model('Mediums', mediumSchema);

module.exports = MediumModel;



// { "name": "Bangla Medium" },

