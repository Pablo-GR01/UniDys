const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect('mongodb://localhost:27017/unidys', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connecté à MongoDB unidys'))
.catch(err => console.error('❌ Erreur MongoDB:', err));

// Schema Utilisateur
const utilisateurSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['prof', 'eleve', 'admin'], default: 'eleve' },
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

// Schema Newsletter
const newsletterSchema = new mongoose.Schema({
  nom: { type: String, default: '' },
  prenom: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  accepteNewsletter: { type: String, enum: ['oui', 'non'], default: 'oui' },
  dateInscription: { type: Date, default: Date.now },
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

// Schema Avis
const avisSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const Avis = mongoose.model('Avis', avisSchema);

/* ROUTES UTILISATEUR */

// Créer un utilisateur
app.post('/api/unidys/users', async (req, res) => {
  try {
    const { nom, prenom, email, password, role, codeProf } = req.body;

    if (!email || !password || !nom || !prenom) {
      return res.status(400).json({ message: 'Nom, prénom, email et mot de passe sont obligatoires.' });
    }

    // Vérifier si email existe déjà
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: 'Email déjà utilisé' });

    // Validation codeProf si prof
    if (role === 'prof' && codeProf !== 'PROF2025') {
      return res.status(400).json({ message: 'Code professeur invalide' });
    }

    // Interdire création admin via cette route
    if (role === 'admin') {
      return res.status(403).json({ message: 'Création admin interdite via cette route' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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

// Liste tous les utilisateurs (sans mot de passe)
app.get('/api/user', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer un utilisateur par ID
app.get('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Login utilisateur
app.post('/api/unidys/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const utilisateur = await User.findOne({ email });
    if (!utilisateur) return res.status(401).json({ message: 'Utilisateur non trouvé' });

    const passwordOk = await bcrypt.compare(password, utilisateur.password);
    if (!passwordOk) return res.status(401).json({ message: 'Mot de passe incorrect' });

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

/* ROUTE NEWSLETTER */

// Inscription newsletter (création ou mise à jour)
app.post('/api/newsletter', async (req, res) => {
  try {
    const { nom = '', prenom = '', email, accepteNewsletter = 'oui' } = req.body;

    if (!email) return res.status(400).json({ message: 'Email requis' });

    const saved = await Newsletter.findOneAndUpdate(
      { email },
      { nom, prenom, email, accepteNewsletter },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: 'Inscription newsletter enregistrée', data: saved });

  } catch (err) {
    console.error('Erreur newsletter :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.post('/api/avis', async (req, res) => {
  console.log('Requête reçue:', req.body);
  try {
    const { nom, prenom, message } = req.body;

    if (!nom || !prenom || !message) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    const nouvelAvis = new Avis({ nom, prenom, message });
    const result = await nouvelAvis.save();
    console.log('Avis sauvegardé:', result);

    res.status(201).json({ message: 'Avis enregistré avec succès !', data: result });
  } catch (err) {
    console.error('Erreur enregistrement avis:', err);
    res.status(500).json({ message: 'Erreur serveur lors de l\'enregistrement de l\'avis.' });
  }
});


// Lancer le serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
});
