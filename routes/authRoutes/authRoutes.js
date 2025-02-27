const express = require('express');
const { registration } = require('../../controllers/userController/userController');
const { logout } = require('../../controllers/userController/logout');

const authRoutes = express.Router();


authRoutes.post("/registration", registration)
authRoutes.post("/logout", logout)


module.exports = authRoutes