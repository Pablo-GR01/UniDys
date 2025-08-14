const express = require('express');
const router = express.Router();
const qcmController = require('../controller/qcm.controller');

// Récupérer résultats d'un QCM pour un élève
router.get('/resultats/:coursId/:userId', qcmController.getResultats);

// Sauvegarder résultats d'un QCM et XP
router.post('/resultats', qcmController.saveResultats);

router.get('/fait/:coursId/:userId', async (req, res) => {
    try {
      const { coursId, userId } = req.params;
  
      // Cherche dans la collection qcmResults
      const result = await QcmResult.findOne({ coursId, userId });
  
      if (result) {
        return res.json({ fait: true });
      } else {
        return res.json({ fait: false });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ fait: false });
    }
});

module.exports = router;
