const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/unidys', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch(err => console.error('Erreur MongoDB:', err));

const utilisateurSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['prof', 'eleve'] },
  codeProf: String,
});

const User = mongoose.model('User', utilisateurSchema);

app.post('/api/inscription', async (req, res) => {
  try {
    const { nom, prenom, email, password, role, codeProf } = req.body;

    // Attention : utiliser User avec majuscule
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    if (role === 'prof' && codeProf !== 'PROF2025') {
      return res.status(400).json({ message: 'Code professeur invalide' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Utiliser User ici aussi
    const nouvelUtilisateur = new User({
      nom,
      prenom,
      email,
      password: hashedPassword,
      role,
      codeProf: role === 'prof' ? codeProf : undefined,
    });

    await nouvelUtilisateur.save();

    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.get('/api/user', async (req, res) => {
  try {
    // Toujours User ici
    const users = await User.find({}, '-password'); // exclut le champ password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});
