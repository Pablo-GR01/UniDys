const mongoose = require('mongoose');

const QcmResultSchema = new mongoose.Schema({
  coursId: { type: String, required: true },
  userId: { type: String, required: true },
  score: { type: Number, default: 0 },
  reponses: { type: [Number], default: [] },
  xpGagne: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('QcmResult', QcmResultSchema);
