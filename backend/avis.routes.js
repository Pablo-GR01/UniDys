const express = require('express');
const router = express.Router();
const Avis = require('./avis.model');

// POST : ajouter un avis
router.post('/', async (req, res) => {
  const { prenom, nom, message } = req.body;

  if (!prenom || !nom || !message) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  try {
    const avis = new Avis({ prenom, nom, message });
    await avis.save();
    res.status(201).json({ message: 'Avis enregistré avec succès !' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l’enregistrement de l’avis.' });
  }
});

module.exports = router;
