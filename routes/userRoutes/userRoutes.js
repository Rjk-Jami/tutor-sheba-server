const express = require('express');
const { getAllDistricts, getAllLocations } = require('../../controllers/userController/userDistrictAndLocation');
const userRoutes = express.Router();

userRoutes.get("/districts", getAllDistricts);
userRoutes.get("/locations", getAllLocations);

module.exports = userRoutes

