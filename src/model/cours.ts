import mongoose from 'mongoose';

const coursSchema = new mongoose.Schema({
  utilisateurId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  titre: { type: String, required: true },
  nomProf: { type: String }, // facultatif
  niveau: { type: String, enum: ['CP', 'CE1', 'CE2', 'CM1', 'CM2'], required: true },
  matiere: { type: String, required: true },
  lienYoutube: { type: String },
  fichierPdf: { type: String, required: true }, // correspond au nom du fichier (ex: uploads/nom.pdf)

  qcms: {
    type: [
      {
        question: String,
        reponses: [String],
        bonneReponse: Number
      }
    ],
    default: [] // facultatif
  },

  dateCreation: { type: Date, default: Date.now }
});

export const Cours = mongoose.model('Cours', coursSchema);
