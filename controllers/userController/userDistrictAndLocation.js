const District = require("../../model/District");
const Location = require("../../model/Location");


// get all districts and locations
// here use .json() for json response and .send() for string response
const getAllDistricts = async (req, res) => {
  try {
    const districts = await District.find();
    res.status(200).json(districts);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

const getAllLocations = async (req, res) => {
  try {
    const { district } = req.query;

    if (!district) {
      return res.status(400).send({ error: "District ID is required" });
    }

    const locations = await Location.find({ district }).populate(
      "district",
      "name"
    );
    res.status(200).json(locations);
  } catch (error) {
    // res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { getAllDistricts, getAllLocations };
