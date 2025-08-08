const mongoose = require('mongoose');

const qcmSchema = new mongoose.Schema({
  question: { type: String, required: true },
  reponses: { type: [String], required: true },
  bonneReponse: { type: Number, required: true },
  xp: { type: Number, required: true, default: 10 }  // XP par question, valeur par défaut 10
});

const coursSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  niveau: { type: String, required: true },
  matiere: { type: String, required: true },
  nomProf: { type: String, required: true },
  lienYoutube: { type: String, default: '' },
  fichierPdf: { type: String, required: true },
  utilisateurId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  qcms: { type: [qcmSchema], default: [] },
  xpTotal: { type: Number, default: 0 } // Optionnel, somme des XP par question si besoin
}, {
  timestamps: true
});

module.exports = mongoose.model('Cours', coursSchema);
