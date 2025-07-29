const mongoose = require('mongoose');

const qcmSchema = new mongoose.Schema({
  question: { type: String, required: true },
  reponses: [{ type: String, required: true }],
  bonneReponse: { type: Number, required: true } // indice de la bonne réponse dans le tableau reponses
}, { _id: false }); // Pas besoin d'_id pour chaque QCM

const coursSchema = new mongoose.Schema({
  utilisateurId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nomProf: { type: String, required: true },
  titre: { type: String, required: true },
  niveau: { type: String, default: '' },
  matiere: { type: String, default: '' },
  lienYoutube: { type: String, default: '' },
  fichierPdf: { type: String, default: '' },
  qcms: [qcmSchema],
  dateCreation: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Cours', coursSchema);
