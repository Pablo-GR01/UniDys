const QcmResult = require('../../schema/qcm');
const User = require('../../schema/user'); // pour ajouter l'XP

// GET /api/qcm/resultats/:coursId/:userId
exports.getResultats = async (req, res) => {
  const { coursId, userId } = req.params;
  try {
    const result = await QcmResult.findOne({ coursId, userId });
    if (!result) return res.status(404).json({ message: 'Résultat QCM non trouvé' });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// POST /api/qcm/resultats
exports.saveResultats = async (req, res) => {
  const { userId, qcmId, score, reponses, xpGagne } = req.body;

  try {
    // Mettre à jour ou créer le résultat du QCM
    let result = await QcmResult.findOne({ coursId: qcmId, userId });
    if (!result) {
      result = new QcmResult({ coursId: qcmId, userId, score, reponses, xpGagne });
    } else {
      result.score = score;
      result.reponses = reponses;
      result.xpGagne = xpGagne;
    }
    await result.save();

    // Ajouter XP à l'utilisateur
    await User.findByIdAndUpdate(userId, { $inc: { xp: xpGagne } });

    res.json({ message: 'Résultats QCM sauvegardés et XP ajouté' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
