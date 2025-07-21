const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect('mongodb://localhost:27017/ta-base', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch(err => console.error('❌ Erreur connexion MongoDB :', err));

// Schéma User
const userSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  email: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, enum: ['prof', 'eleve'], default: 'eleve' },
});

const User = mongoose.model('User', userSchema);

// Route inscription (POST /api/users)
app.post('/api/users', async (req, res) => {
  try {
    const { nom, prenom, email, password, role } = req.body;

    if (!nom || !prenom || !email || !password || !role) {
      return res.status(400).json({ message: 'Champs manquants' });
    }

    // Vérifier si email déjà utilisé
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    // Hasher le mot de passe
    const passwordHash = await bcrypt.hash(password, 10);

    // Créer utilisateur
    const newUser = new User({
      nom,
      prenom,
      email,
      passwordHash,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: 'Utilisateur créé' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));
