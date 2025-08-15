// backend/controller/qcm.controller.js
const QcmResult = require('../../schema/qcm');

exports.getResultsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const results = await QcmResult.find({ userId });
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
