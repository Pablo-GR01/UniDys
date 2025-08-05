// routes/cours-html-route.js
const express = require('express');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const router = express.Router();
const CoursModel = require('../models/cours'); // adapte le chemin vers ton modèle mongoose

router.get('/api/cours/html/:id', async (req, res) => {
  const idCours = req.params.id;

  try {
    const cours = await CoursModel.findById(idCours);
    if (!cours) return res.status(404).send('Cours non trouvé');

    const pdfPath = `./uploads/${cours.fichierPdf}`; // chemin vers le fichier PDF

    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(dataBuffer);

    const htmlSimple = data.text
      .split('\n')
      .map(line => `<p>${line.trim()}</p>`)
      .join('');

    res.send(htmlSimple);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la conversion PDF');
  }
});

module.exports = router;
