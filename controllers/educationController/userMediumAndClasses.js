
// get all Mediums and Classes

const ClassModel = require("../../model/ClassModel");
const MediumModel = require("../../model/MediumModel");

// here use .json() for json response and .send() for string response
const getAllMediums = async (req, res) => {
  try {
    const mediums = await MediumModel.find();
    res.status(200).json(mediums);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

const getAllClasses = async (req, res) => {
  try {
    const { medium } = req.query;

    if (!medium) {
      return res.status(400).send({ error: "medium ID is required" });
    }

    const classes = await ClassModel.find({ medium }).populate(
      "medium",
      "name"
    );
    res.status(200).json(classes);
  } catch (error) {
    // res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { getAllMediums, getAllClasses };
