const express = require('express');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const Cours = require('../../schema/cours'); // ajuste le chemin si besoin

const router = express.Router();

router.get('/api/cours/html/:id', async (req, res) => {
  const idCours = req.params.id;

  try {
    const cours = await Cours.findById(idCours);
    if (!cours) return res.status(404).send('Cours non trouvé');

    const pdfPath = `./uploads/${cours.fichierPdf}`;
    if (!fs.existsSync(pdfPath)) return res.status(404).send('Fichier PDF non trouvé');

    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(dataBuffer);

    // Conversion simple : chaque ligne devient un paragraphe
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
