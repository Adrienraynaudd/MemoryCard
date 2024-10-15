const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');


const userRoutes = require('./Routes/UserRoutes');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});

app.use(compression());

const username = encodeURIComponent('paulpiauger2');
const password = encodeURIComponent('TjPJIv2wnVUdflrb');


mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.muatb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`).then(() => {
  console.log('Connected to MongoDB with Success !');
}).catch((err) => {
  console.log('MongoDB ERROR', err);
});

app.use(bodyParser.json());


app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Bonjour, monde !');
});

app.use('/api/users', userRoutes);