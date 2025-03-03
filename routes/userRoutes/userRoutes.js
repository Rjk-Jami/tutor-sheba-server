const express = require('express');
const { getAllDistricts, getAllLocations } = require('../../controllers/userController/userDistrictAndLocation');
const { getAllMediums, getAllClasses } = require('../../controllers/educationController/userMediumAndClasses');
const { getAllTuition } = require('../../controllers/tuitionController/tuitionController');
const userRoutes = express.Router();

userRoutes.get("/districts", getAllDistricts);
userRoutes.get("/locations", getAllLocations);
userRoutes.get("/mediums", getAllMediums);
userRoutes.get("/classes", getAllClasses);
userRoutes.get("/tuitions", getAllTuition);

module.exports = userRoutes

