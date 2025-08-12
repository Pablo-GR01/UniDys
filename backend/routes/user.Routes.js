// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../../schema/user'); // Assure-toi que le chemin est correct

const userController = require('../controller/user.Controller');
const authController = require('../controller/auth.controller');

router.post('/users', userController.registerUser);
router.post('/login', authController.login);
router.get('/users/:email', userController.getUserByEmail);
router.delete('/users/:id', userController.deleteUserById);

module.exports = router;
