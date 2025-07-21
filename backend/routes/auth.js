const express = require('express');
const router = express.Router();
const User = require('../model/user');

// POST /api/register
router.post('/register', async (req, res) => {
  try {
    const { username, firstName, lastName, email, password, role, inilial, color } = req.body;

    // Créer un nouvel utilisateur
    const newUser = new User({
      username,
      firstName,
      lastName,
      email,
      password, // (à chiffrer plus tard avec bcrypt)
      role,
      inilial,
      color
    });

    await newUser.save();

    res.status(201).json({ message: "Utilisateur enregistré avec succès !" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur ou email déjà utilisé" });
  }
});

module.exports = router;

router.post('/inscription', async (req, res) => {
  try {
    const { nom, prenom, email, password, role } = req.body;

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const newUser = new User({
      username: `${prenom}.${nom}`.toLowerCase(),
      firstName: prenom,
      lastName: nom,
      email,
      password,
      role,
      inilial: `${prenom[0]}${nom[0]}`.toUpperCase()
    });

    await newUser.save();
    res.status(201).json({ message: 'Utilisateur enregistré' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
