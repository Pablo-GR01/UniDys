const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  nom: { type: String, default: '' },
  prenom: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  accepteNewsletter: { type: String, enum: ['oui', 'non'], default: 'oui' },
  dateInscription: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Newsletter', newsletterSchema);
