const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  phone: {
    type: String,
    required: true,
    
  },
  email: {
    type: String,
    required: true,
    unique: true,
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