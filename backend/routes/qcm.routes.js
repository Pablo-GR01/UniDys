const express = require('express');
const router = express.Router();
const qcmController = require('../controller/qcm.controller');

// Récupérer résultats d'un QCM pour un élève
router.get('/resultats/:coursId/:userId', qcmController.getResultats);

// Sauvegarder résultats d'un QCM et XP
router.post('/resultats', qcmController.saveResultats);

module.exports = router;
