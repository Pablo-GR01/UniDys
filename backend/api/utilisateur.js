const express = require('express');
const app = express();
const PORT = 3000;

app.get('/api/utilisateur', (req, res) => {
  res.json({ nom: 'Pablo', prenom: 'GR' });  // Exemple de données utilisateur
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
