// backend/routes/qcm.routes.js
const express = require('express');
const router = express.Router();
const qcmController = require('../controller/qcm.controller');

router.get('/results/user/:userId', qcmController.getResultsByUser);

module.exports = router;
