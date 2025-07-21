const mongoose = require('mongoose');

const utilisateurSchema = new mongoose.Schema(
  {
    
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // requis uniquement en inscription classique
    role: { type: String, enum: ["eleve", "prof"], default: "eleve" },
    initiale: {type: String}
  },
  {
    timestamps: true, // gère automatiquement createdAt et updatedAt
  }
);

const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema);

module.exports = Utilisateur;
