const User = require('../../schema/user');

// Inscription
exports.registerUser = async (req, res) => {
  try {
    const { nom, prenom, email, password, role, codeProf } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Utilisateur déjà inscrit' });

    const user = new User({ nom, prenom, email, password, role, codeProf });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer un utilisateur par email
exports.getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Supprimer un utilisateur
exports.deleteUserById = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ajouter XP
exports.addXP = async (req, res) => {
  try {
    const { xp } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    user.xp = (user.xp || 0) + xp;
    await user.save();
    res.json({ message: 'XP ajouté', updatedXP: user.xp });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // récupère tous les utilisateurs
    res.status(200).json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};