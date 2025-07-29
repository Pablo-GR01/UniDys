const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect('mongodb://localhost:27017/unidys', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Connecté à MongoDB'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

// 🔽 Import des modèles
const User = require('./schema/user');
const Newsletter = require('./schema/newletter');
const Avis = require('./schema/avis');
const Cours = require('./schema/cours');

// 📁 Configuration multer
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, 'uploads/'),
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

/** ========================
 * ✅ ROUTES API
 * ======================= */

// 🔐 Inscription
app.post('/api/unidys/users', async (req, res) => {
  try {
    const { nom, prenom, email, password, role, codeProf } = req.body;

    if (!nom || !prenom || !email || !password)
      return res.status(400).json({ message: 'Champs requis manquants.' });

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: 'Email déjà utilisé' });

    if (role === 'prof' && codeProf !== 'PROF2025')
      return res.status(400).json({ message: 'Code professeur invalide' });

    if (role === 'admin')
      return res.status(403).json({ message: 'Création admin interdite' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      nom,
      prenom,
      email,
      password: hashedPassword,
      role,
      codeProf: role === 'prof' ? codeProf : undefined,
    });

    await user.save();
    const utilisateurSansMdp = await User.findById(user._id).select('-password');
    res.status(201).json(utilisateurSansMdp);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 🔑 Connexion
app.post('/api/unidys/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Utilisateur non trouvé' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Mot de passe incorrect' });

    res.json({
      _id: user._id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role,
    });

  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 📧 Newsletter
app.post('/api/newsletter', async (req, res) => {
  try {
    const { nom = '', prenom = '', email, accepteNewsletter = 'oui' } = req.body;
    if (!email) return res.status(400).json({ message: 'Email requis' });

    const saved = await Newsletter.findOneAndUpdate(
      { email },
      { nom, prenom, email, accepteNewsletter },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: 'Inscription enregistrée', data: saved });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 📝 Ajouter un avis
app.post('/api/avis', async (req, res) => {
  try {
    const { nom, prenom, message } = req.body;
    if (!nom || !prenom || !message)
      return res.status(400).json({ message: 'Tous les champs sont requis' });

    const avis = new Avis({ nom, prenom, message });
    await avis.save();
    res.status(201).json({ message: 'Avis enregistré', data: avis });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 📚 Créer un cours avec fichier PDF + QCM
app.post('/api/cours', upload.single('pdf'), async (req, res) => {
  try {
    const { titre, niveau, matiere, nomProf, lienYoutube, qcms } = req.body;
    const fichier = req.file;

    if (!titre || !niveau || !matiere || !fichier)
      return res.status(400).json({ message: 'Champs requis manquants' });

    const utilisateur = await User.findOne({
      nom: new RegExp(nomProf?.split(' ')[1], 'i'),
      prenom: new RegExp(nomProf?.split(' ')[0], 'i'),
      role: 'prof'
    });

    let qcmArray = [];
    try {
      qcmArray = qcms ? JSON.parse(qcms) : [];
    } catch {
      return res.status(400).json({ message: 'Erreur de format des QCM' });
    }

    const cours = new Cours({
      titre,
      niveau,
      matiere,
      nomProf,
      lienYoutube: lienYoutube || '',
      fichierPdf: fichier.filename,
      utilisateurId: utilisateur?._id || new mongoose.Types.ObjectId(),
      qcms: qcmArray,
    });

    await cours.save();

    res.status(201).json({
      message: 'Cours enregistré',
      data: { ...cours.toObject(), pdf: `/uploads/${cours.fichierPdf}` }
    });

  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 🔎 Cours par nom du prof
app.get('/api/cours/prof/:nomProf', async (req, res) => {
  try {
    const cours = await Cours.find({ nomProf: req.params.nomProf });
    res.json(cours.map(c => ({ ...c.toObject(), pdf: `/uploads/${c.fichierPdf}` })));
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// 📤 Modifier le PDF
app.put('/api/cours/:id/fichier', upload.single('pdf'), async (req, res) => {
  try {
    const cours = await Cours.findById(req.params.id);
    if (!cours) return res.status(404).json({ error: 'Cours non trouvé' });

    if (cours.fichierPdf) {
      const oldPath = path.join(__dirname, 'uploads', cours.fichierPdf);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    cours.fichierPdf = req.file.filename;
    await cours.save();

    res.json({ message: 'Fichier mis à jour', cours });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ Supprimer un cours
app.delete('/api/cours/:id', async (req, res) => {
  try {
    const cours = await Cours.findById(req.params.id);
    if (!cours) return res.status(404).json({ error: 'Cours non trouvé' });

    if (cours.fichierPdf) {
      const pdfPath = path.join(__dirname, 'uploads', cours.fichierPdf);
      if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    }

    await cours.deleteOne();
    res.json({ message: 'Cours supprimé' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ▶️ Démarrage du serveur
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`));
