import mongoose from 'mongoose';

const coursSchema = new mongoose.Schema({
  nomProf: { type: String }, // ✅ ajouté ici
  utilisateurId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  titre: { type: String, required: true },
  niveau: { type: String, enum: ['CP', 'CE1', 'CE2', 'CM1', 'CM2'], required: true },
  matiere: { type: String, required: true },               // ✅ ajouté
  lienYoutube: { type: String },                           // ✅ ajouté
  fichierPdf: { type: String, required: true },            // ✅ ajouté
  dateCreation: { type: Date, default: Date.now },
});

export const Cours = mongoose.model('Cours', coursSchema);
