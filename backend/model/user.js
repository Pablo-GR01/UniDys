const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['prof', 'eleve'] },
});

module.exports = mongoose.model('User', userSchema);
