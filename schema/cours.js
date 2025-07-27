const mongoose = require('mongoose');

const coursSchema = new mongoose.Schema({
  utilisateurId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nomProf: { type: String, required: true },
  titre: String,
  niveau: String,
  matiere: String,
  lienYoutube: String,
  fichierPdf: String,
  qcms: [
    {
      question: { type: String, required: true },
      reponses: [{ type: String, required: true }],
      bonneReponse: { type: Number, required: true }
    }
  ],
  dateCreation: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Cours', coursSchema);
