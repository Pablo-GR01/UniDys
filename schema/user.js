const mongoose = require('mongoose');

const utilisateurSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['prof', 'eleve', 'admin'], default: 'eleve' },
  codeProf: String,
  initiale: String,
  xp: { type: Number, default: 0 },
});

utilisateurSchema.pre('save', function (next) {
  if (this.nom && this.prenom) {
    this.initiale = (this.prenom[0] + this.nom[0]).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('User', utilisateurSchema);
