const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connexion MongoDB
mongoose.connect('mongodb://localhost:27017/unidys', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connecté à MongoDB unidys'))
.catch(err => console.error('❌ Erreur MongoDB:', err));

/* =======================
   🔹 SCHEMA UTILISATEUR
========================== */
const utilisateurSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['prof', 'eleve'] },
  codeProf: String,
  initiale: String,
});

// Générer les initiales avant sauvegarde
utilisateurSchema.pre('save', function (next) {
  if (this.nom && this.prenom) {
    this.initiale = (this.prenom[0] + this.nom[0]).toUpperCase();
  }
  next();
});

const User = mongoose.model('User', utilisateurSchema);

/* =======================
   🔹 SCHEMA NEWSLETTER
========================== */
const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  newsletter: { type: String, enum: ['Oui', 'Non'], default: 'Non' },
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

/* =======================
   ✅ ROUTES UTILISATEUR
========================== */

// Créer un utilisateur
app.post('/api/unidys/users', async (req, res) => {
  try {
    const { nom, prenom, email, password, role, codeProf } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: 'Email déjà utilisé' });

    if (role === 'prof' && codeProf !== 'PROF2025') {
      return res.status(400).json({ message: 'Code professeur invalide' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nouvelUtilisateur = new User({
      nom,
      prenom,
      email,
      password: hashedPassword,
      role,
      codeProf: role === 'prof' ? codeProf : undefined
    });

    await nouvelUtilisateur.save();
    res.status(201).json({ message: 'Utilisateur créé avec succès' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir tous les utilisateurs (sans mot de passe)
app.get('/api/user', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ Route correcte pour récupérer l'utilisateur connecté
app.get('/api/user/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.json({
      nom: user.nom,
      prenom: user.prenom,
      role: user.role
    });

  } catch (err) {
    console.error('Erreur API utilisateur:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Login utilisateur
app.post('/api/unidys/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const utilisateur = await User.findOne({ email, role });
    if (!utilisateur) {
      return res.status(401).json({ message: 'Utilisateur non trouvé ou rôle incorrect' });
    }

    const passwordOk = await bcrypt.compare(password, utilisateur.password);
    if (!passwordOk) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    res.json({
      _id: utilisateur._id,
      nom: utilisateur.nom,
      prenom: utilisateur.prenom,
      email: utilisateur.email,
      role: utilisateur.role,
      initiale: utilisateur.initiale,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/* =======================
   ✅ ROUTE NEWSLETTER
========================== */
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email, newsletter } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email requis' });
    }

    const saved = await Newsletter.findOneAndUpdate(
      { email },
      { email, newsletter },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: 'Inscription newsletter enregistrée', data: saved });

  } catch (err) {
    console.error('Erreur newsletter :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

/* =======================
   🚀 SERVEUR EXPRESS
========================== */
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
});
