const express = require('express');
const router = express.Router();
const User = require('../model/user');

// Route d'inscription
router.post('/inscription', async (req, res) => {
  const { nom, prenom, email, password, role } = req.body;

  try {
    // Vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const newUser = new User({ nom, prenom, email, password, role });
    await newUser.save();

    res.status(201).json({ message: 'Utilisateur enregistré' });
  } catch (error) {
    console.error('Erreur lors de l’enregistrement :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
