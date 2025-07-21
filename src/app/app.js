const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const inscriptionRouter = require('../page/inscription/inscription');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/unidys', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch(err => console.error('Erreur MongoDB:', err));

app.use(inscriptionRouter); // ajoute la route inscription

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
