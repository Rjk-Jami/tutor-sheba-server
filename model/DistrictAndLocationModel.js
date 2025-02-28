const mongoose = require('mongoose');

const districtSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

module.exports = mongoose.model('District', districtSchema);

const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  district: { type: mongoose.Schema.Types.ObjectId, ref: 'District', required: true }
});

module.exports = mongoose.model('Location', locationSchema);
