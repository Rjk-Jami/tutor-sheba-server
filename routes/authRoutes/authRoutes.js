const express = require('express');
const { registration, login } = require('../../controllers/userController/userController');
const { logout } = require('../../controllers/userController/logout');
const { verifySession } = require('../../controllers/verifySession/verifySession');
const { isAuthenticated } = require('../../middlewear/isAuthenticated');

const authRoutes = express.Router();


authRoutes.post("/registration", registration)
authRoutes.post("/logout", logout)
authRoutes.post("/login", login)
authRoutes.get("/verify-session",isAuthenticated, verifySession)


module.exports = authRoutes