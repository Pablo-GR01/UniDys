const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// 📁 Servir les fichiers PDF statiques depuis /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 🔌 Connexion MongoDB
mongoose.connect('mongodb://localhost:27017/unidys', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connecté à MongoDB unidys'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

// ========================
// 🔹 IMPORT DES MODELS
// ========================
const User = require('./schema/user')
const Newsletter = require('./schema/newletter');
const Avis = require('./schema/avis');
const Cours = require('./schema/cours');

// ========================
// 🔸 MULTER PDF Upload
// ========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// ========================
// 🔹 ROUTES API
// ========================

// --- Créer un utilisateur
app.post('/api/unidys/users', async (req, res) => {
  try {
    const { nom, prenom, email, password, role, codeProf } = req.body;

    if (!email || !password || !nom || !prenom) {
      return res.status(400).json({ message: 'Nom, prénom, email et mot de passe sont obligatoires.' });
    }

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: 'Email déjà utilisé' });

    if (role === 'prof' && codeProf !== 'PROF2025') {
      return res.status(400).json({ message: 'Code professeur invalide' });
    }

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

    // Récupérer utilisateur complet sans password
    const utilisateurComplet = await User.findById(nouvelUtilisateur._id).select('-password');

    res.status(201).json(utilisateurComplet);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// --- Connexion utilisateur
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

// --- Inscription newsletter
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

// --- Créer un avis
app.post('/api/avis', async (req, res) => {
  try {
    const { nom, prenom, message } = req.body;
    if (!nom || !prenom || !message) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    const nouvelAvis = new Avis({ nom, prenom, message });
    const result = await nouvelAvis.save();

    res.status(201).json({ message: 'Avis enregistré avec succès !', data: result });
  } catch (err) {
    console.error('Erreur enregistrement avis:', err);
    res.status(500).json({ message: 'Erreur serveur lors de l\'enregistrement de l\'avis.' });
  }
});

// --- Créer un cours (avec QCM facultatif et prof optionnel)
// Dans ta route POST /api/cours
app.post('/api/cours', upload.single('pdf'), async (req, res) => {
  try {
    const { titre, niveau, matiere, nomProf, lienYoutube } = req.body;
    const fichier = req.file;

    if (!titre || !niveau || !matiere || !fichier) {
      return res.status(400).json({ message: 'Titre, niveau, matière et fichier PDF sont requis.' });
    }

    let utilisateurId = null;

    if (nomProf) {
      const parts = nomProf.trim().split(' ');
      if (parts.length >= 2) {
        const prenom = parts.shift();
        const nom = parts.join(' ');
        const utilisateur = await User.findOne({
          nom: new RegExp(`^${nom}$`, 'i'),
          prenom: new RegExp(`^${prenom}$`, 'i'),
          role: 'prof',
        });

        if (utilisateur) {
          utilisateurId = utilisateur._id;
        }
      }
    }

    if (!utilisateurId) {
      utilisateurId = new mongoose.Types.ObjectId(); // ID bidon
    }

    // Parse bien le JSON contenu dans req.body.qcms (string)
    let qcms = [];
    if (req.body.qcms) {
      try {
        qcms = JSON.parse(req.body.qcms);

        // On filtre les QCM invalides, sécu
        if (!Array.isArray(qcms)) qcms = [];
        else {
          qcms = qcms.filter(q => 
            q.question && Array.isArray(q.reponses) && typeof q.bonneReponse === 'number'
          );
        }
      } catch (err) {
        return res.status(400).json({ message: 'Erreur de format des QCM.' });
      }
    }

    const nouveauCours = new Cours({
      titre,
      niveau,
      matiere,
      nomProf: nomProf || '',
      lienYoutube: lienYoutube || '',
      fichierPdf: fichier.filename,
      utilisateurId,
      qcms
    });

    await nouveauCours.save();
    res.status(201).json({ message: 'Cours enregistré avec succès', data: nouveauCours });

  } catch (err) {
    console.error('Erreur cours:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la création du cours.' });
  }
});


// --- 🔍 Obtenir les cours créés par un utilisateur (professeur)
app.get('/api/cours/prof/:nomProf', async (req, res) => {
  try {
    const { nomProf } = req.params;
    const cours = await Cours.find({ nomProf }); // bien 'nomProf'
    res.json(cours);
  } catch (err) {
    console.error('Erreur récupération cours par nomProf :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.get('/api/cours/:id', async (req, res) => {
  try {
    const cours = await Cours.findById(req.params.id);
    res.json(cours);
  } catch (error) {
    res.status(404).json({ message: 'Cours introuvable' });
  }
});

// Exemple de route pour servir un fichier PDF stocké sur le serveur
app.get('/uploads/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);
  res.sendFile(filePath);
});




// ========================
// 🔸 Lancer le serveur
// ========================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
});
