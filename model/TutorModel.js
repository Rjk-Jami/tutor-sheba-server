const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female'],
  },
  district: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "District",
    required: true,
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
  preferredArea: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Location",
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const TutorModel = mongoose.model("Tutor", tutorSchema);


module.exports = { TutorModel };
