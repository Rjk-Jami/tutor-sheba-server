const express = require('express');
const { registration, login } = require('../../controllers/userController/userController');
const { logout } = require('../../controllers/userController/logout');

const authRoutes = express.Router();


authRoutes.post("/registration", registration)
authRoutes.post("/logout", logout)
authRoutes.post("/login", login)


module.exports = authRoutes