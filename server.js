// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connecte MongoDB
mongoose.connect('mongodb://localhost:27017/tondb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Modèle utilisateur
const utilisateurSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  codeProf: String,
});

const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema);

// Route inscription
app.post('/api/inscription', async (req, res) => {
  try {
    const { nom, prenom, email, password, role, codeProf } = req.body;

    // Vérifier si email existe
    const exist = await Utilisateur.findOne({ email });
    if (exist) return res.status(400).json({ message: 'Email déjà utilisé' });

    // Créer utilisateur
    const utilisateur = new Utilisateur({ nom, prenom, email, password, role, codeProf });
    await utilisateur.save();

    res.status(201).json({ message: 'Compte créé avec succès !' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.listen(3000, () => console.log('Serveur lancé sur le port 3000'));
