const express = require('express');
const { registration } = require('../../controllers/userController/userController');

const authRoutes = express.Router();


authRoutes.post("/registration", registration)


module.exports = authRoutes