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


// ✅ Modifier un utilisateur par ID
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params; // Récupère l'ID de l'URL
    const updates = req.body;  // Récupère les nouvelles infos envoyées par Angular

    // Mise à jour dans MongoDB
    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error("Erreur updateUser:", err);
    res.status(500).json({ message: "Erreur lors de la modification de l'utilisateur" });
  }
};

// Changer le mot de passe
exports.changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    // Vérifier l'ancien mot de passe
    if (user.password !== oldPassword) { // ⚠️ Pour production, hash avec bcrypt !
      return res.status(400).json({ message: 'Ancien mot de passe incorrect' });
    }

    user.password = newPassword; // ⚠️ hash le mot de passe en prod
    await user.save();

    res.json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la modification du mot de passe' });
  }
};
