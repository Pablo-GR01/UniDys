// controllers/userController.js
const userService = require('../../src/services/userService');

exports.registerUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error('Erreur inscription :', error.message);
    res.status(400).json({ message: error.message });
  }
};
