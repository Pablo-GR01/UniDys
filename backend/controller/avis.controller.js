const mongoose = require('mongoose');

// Schema Newsletter / Avis
const newsletterSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

// Modèle basé sur la collection 'newsletters'
//const Newsletter = mongoose.model('Newsletter', newsletterSchema, 'newsletters');

// GET /api/newsletters
exports.getAvis = async (req, res) => {
  try {
    const avisList = await Newsletter.find().sort({ date: -1 }).limit(4);
    res.json(avisList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors du chargement des avis' });
  }
};

// POST /api/newsletters
exports.postAvis = async (req, res) => {
  try {
    const { nom, prenom, message } = req.body;
    if (!nom || !prenom || !message) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
    }
    const nouvelAvis = new Newsletter({ nom, prenom, message });
    await nouvelAvis.save();
    res.status(201).json(nouvelAvis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'ajout de l\'avis' });
  }
};
