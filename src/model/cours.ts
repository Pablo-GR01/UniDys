import mongoose from 'mongoose';

const coursSchema = new mongoose.Schema({
  utilisateurId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  titre: { type: String, required: true },
  niveau: { type: String, enum: ['CP', 'CE1', 'CE2', 'CM1', 'CM2'], required: true },
  contenu: { type: String, required: true },
  dateCreation: { type: Date, default: Date.now },
});

// ✅ On exporte le modèle
export const Cours = mongoose.model('Cours', coursSchema);
