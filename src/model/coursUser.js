import mongoose, { Schema } from 'mongoose';

const CoursUserSchema = new Schema({
  utilisateurId: { type: String, required: true },
  titre: { type: String, required: true },
  niveau: { type: String, required: true },
  etat: { type: String, enum: ['termine', 'en_cours'], required: true },
  date: { type: Date, default: Date.now },
});

const CoursUser = mongoose.model('CoursUser', CoursUserSchema);

export default CoursUser;
