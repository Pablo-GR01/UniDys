// routes/userRoutes.js
const express = require('express');
const router = express.Router();

const userController = require('../controller/user.Controller');
const authController = require('../controller/auth.controller');

router.post('/users', userController.registerUser);
router.post('/login', authController.login);

module.exports = router;
