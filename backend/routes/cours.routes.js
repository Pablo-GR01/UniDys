const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Cours = require('../../schema/cours');
const User = require('../../schema/user');

// Configuration Multer pour stocker les PDF
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// POST créer un cours avec upload PDF + QCM
router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    const { titre, niveau, matiere, lienYoutube, utilisateurId } = req.body;
    const fichier = req.file;

    if (!titre || !niveau || !matiere || !fichier || !utilisateurId) {
      return res.status(400).json({ message: 'Champs requis manquants.' });
    }

    const user = await User.findById(utilisateurId);
    if (!user) return res.status(400).json({ message: 'Utilisateur non trouvé.' });

    let qcms = [];
    if (req.body.qcms) {
      try {
        qcms = JSON.parse(req.body.qcms);
        if (!Array.isArray(qcms)) qcms = [];
      } catch {
        return res.status(400).json({ message: 'Format QCM invalide.' });
      }
    }

    const nomProfComplet = `${user.prenom} ${user.nom}`.trim();

    const nouveauCours = new Cours({
      titre,
      niveau,
      matiere,
      nomProf: nomProfComplet,
      lienYoutube: lienYoutube || '',
      fichierPdf: fichier.filename,
      utilisateurId,
      qcms,
    });

    await nouveauCours.save();

    res.status(201).json({
      message: 'Cours créé',
      data: { ...nouveauCours.toObject(), pdfUrl: `/uploads/${fichier.filename}` }
    });

  } catch (err) {
    console.error('Erreur création cours:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la création du cours.' });
  }
});

// GET cours par nomProf complet (insensible à la casse)
router.get('/prof/:nomProf', async (req, res) => {
  try {
    const { nomProf } = req.params;
    const regex = new RegExp(`^${nomProf}$`, 'i'); // insensible à la casse

    const coursProf = await Cours.find({ nomProf: regex });

    const coursAvecPdfUrl = coursProf.map(c => {
      const obj = c.toObject();
      obj.pdfUrl = c.fichierPdf ? `/uploads/${c.fichierPdf}` : null;
      return obj;
    });

    res.json(coursAvecPdfUrl);
  } catch (err) {
    console.error('Erreur récupération cours par nomProf:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des cours' });
  }
});

// PUT /api/cours/:id — modifier titre et fichier PDF
router.put('/:id', upload.single('fichierPdf'), async (req, res) => {
  try {
    const { titre } = req.body;
    const nouveauFichier = req.file;

    const cours = await Cours.findById(req.params.id);
    if (!cours) return res.status(404).json({ message: 'Cours non trouv\u00e9.' });

    if (titre) cours.titre = titre;

    if (nouveauFichier) {
      if (cours.fichierPdf) {
        const ancienPath = path.join(__dirname, '../../uploads', cours.fichierPdf);
        if (fs.existsSync(ancienPath)) fs.unlinkSync(ancienPath);
      }
      cours.fichierPdf = nouveauFichier.filename;
    }

    await cours.save();

    res.json({
      message: 'Cours modifi\u00e9 avec succ\u00e8s.',
      cours: {
        ...cours.toObject(),
        pdfUrl: cours.fichierPdf ? `/uploads/${cours.fichierPdf}` : null,
      }
    });

  } catch (err) {
    console.error('Erreur modification cours:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la modification du cours.' });
  }
});

// DELETE supprimer un cours avec suppression fichier PDF
router.delete('/:id', async (req, res) => {
  try {
    const cours = await Cours.findById(req.params.id);
    if (!cours) return res.status(404).json({ message: 'Cours non trouvé.' });

    if (cours.fichierPdf) {
      const pdfPath = path.join(__dirname, '../../uploads', cours.fichierPdf);
      if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    }

    await cours.deleteOne();
    res.json({ message: 'Cours supprimé.' });

  } catch (err) {
    console.error('Erreur suppression cours:', err);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression du cours.' });
  }
});

module.exports = router;
