const express = require('express');
const router = express.Router();
const User = require('../../schema/user'); // Assure-toi que le chemin est correct
const userController = require('../controller/user.Controller');
const authController = require('../controller/auth.controller');

// Routes utilisateurs
router.post('/users', userController.registerUser);
router.post('/login', authController.login);
router.get('/users/:email', userController.getUserByEmail);
router.delete('/users/:id', userController.deleteUserById);
router.get('/unidys/users', userController.getAllUsers);
// Route pour ajouter XP
router.post('/users/:id/ajouterXP', async (req, res) => {
  const { id } = req.params;
  const { xp } = req.body;

  if (!xp || xp <= 0) return res.status(400).json({ message: 'XP invalide' });

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    user.xp = (user.xp || 0) + xp;
    await user.save();

    res.json({ updatedXP: user.xp });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
