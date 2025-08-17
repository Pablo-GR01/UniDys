const express = require('express');
const router = express.Router();
const userController = require('../controller/user.Controller');
const authController = require('../controller/auth.controller');

// Utilisateurs
router.post('/users', userController.registerUser);
router.post('/login', authController.login);
router.get('/users/:email', userController.getUserByEmail);
router.delete('/users/:id', userController.deleteUserById);
router.post('/users/:id/ajouterXP', userController.addXP);


router.get('/counts', async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const totalProfessors = await User.countDocuments({ role: 'Professeur' });
      const totalStudents = await User.countDocuments({ role: 'Élève' });
  
      res.json({ totalUsers, totalProfessors, totalStudents });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
module.exports = router;
