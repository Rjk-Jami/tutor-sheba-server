const express = require('express');
const { getAllDistricts, getAllLocations } = require('../../controllers/userController/userDistrictAndLocation');
const { getAllMediums, getAllClasses } = require('../../controllers/educationController/userMediumAndClasses');
const userRoutes = express.Router();

userRoutes.get("/districts", getAllDistricts);
userRoutes.get("/locations", getAllLocations);
userRoutes.get("/mediums", getAllMediums);
userRoutes.get("/classes", getAllClasses);

module.exports = userRoutes

