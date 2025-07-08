const mongoose = require('mongoose');

const utilisateurSchema = new mongoose.Schema({
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum:[ "eleve", "prof"]},
  updatedAt: {type: String, required: true},
  createdAt: {type: String, required: true},
});

const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema);

module.exports = Utilisateur;







// const mongoose = require('mongoose')
// const { Schema } = mongoose

// const PlayerSchema = new Schema({
//     username: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     score: {
//         type: Number,
//         min: 0,
//         required: true,
//         default: 0
//     },
//     updatedAt: {
//         type: Date,
//         required: true,
//         default: new Date()
//     },
//     createdAt: {
//         type: Date,
//         required: true,
//         default: new Date()
//     }
// })

// module.exports = PlayerSchema