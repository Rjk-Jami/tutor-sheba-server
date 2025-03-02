const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  medium: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mediums",
    required: true,
  },
});

const ClassModel =  mongoose.model("Classes", classSchema);

module.exports = ClassModel;


// {
//     "name": "",
//     "medium": {
//         "$oid": ""
//     }
// },