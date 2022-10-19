const express = require ('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path');
const saucesRoutes = require('./routes/saucesRoutes')
const userRoutes = require('./routes/usersRoutes')
// import environement variables
require('dotenv').config();

app.use(express.json()); // Remplace bodyparser // 

mongoose.connect(process.env.database_url,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use('/api/sauces', saucesRoutes) // Routes par défaut des sauces
app.use('/api/auth', userRoutes) // Routes par défaut pour l'inscription/connection
app.use('/images', express.static(path.join(__dirname, 'images'))) // Permet l'acces a la ressource statique image

module.exports = app 