const Cours = require('../../schema/cours');
const User = require('../../schema/user');
const path = require('path');
const fs = require('fs');

exports.creerCours = async (req, res) => {
  try {
    const { titre, niveau, matiere, nomProf, lienYoutube, utilisateurId } = req.body;
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

    const nouveauCours = new Cours({
      titre,
      niveau,
      matiere,
      nomProf: `${user.prenom} ${user.nom}`.trim(), // Toujours prénom + nom
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
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


// Autres méthodes : listerCoursParProf, supprimerCours, modifierPdfCours ...

exports.creerCours = async (req, res) => { /* ... */ }
exports.listerCoursParProf = async (req, res) => { /* ... */ }
exports.supprimerCours = async (req, res) => { /* ... */ }
exports.modifierPdfCours = async (req, res) => { /* ... */ }
