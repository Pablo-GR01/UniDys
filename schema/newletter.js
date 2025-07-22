const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Schéma newsletter
const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  dateInscription: { type: Date, default: Date.now },
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

// POST /api/newsletter
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    const nouveau = new Newsletter({ email });
    await nouveau.save();
    res.status(201).json({ message: 'Email enregistré' });
  } catch (err) {
    res.status(400).json({ message: 'Erreur', error: err });
  }
});

module.exports = router;
