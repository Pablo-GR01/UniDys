// controllers/userController.js
const User = require('../../schema/user'); // Assure-toi que le chemin est correct

exports.registerUser = async (req, res) => {
  try {
    // Ici tu peux avoir une logique de création avec validation etc.
    // Par exemple :
    const { email, prenom, nom, xp } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email requis' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Utilisateur déjà inscrit' });
    }

    const user = new User({ email, prenom, nom, xp: xp || 0 });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    console.error('Erreur inscription :', error.message);
    res.status(400).json({ message: error.message });
  }
};

exports.getUserByEmail = async (req, res) => {
  const email = req.params.email;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    console.error('Erreur serveur:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
