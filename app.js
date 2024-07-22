const express = require('express');
const app = express();
const port = 3001;
const mongoose = require('mongoose');
const articlesRoutes = require('./routes/articles');
const path = require('path');
const errorHandler = require('./middlewares/errorHandler');
const usersRoutes = require('./routes/users');
require('dotenv').config()
const createAdmin = require('./config/initAdmin')

mongoose.connect(process.env.CONNECT_MONGO_DB)
  .then(() => {
    console.log('Connexion à MongoDB réussie !')
    createAdmin();
  })
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/articles', articlesRoutes);
app.use('/auth', usersRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(errorHandler);

module.exports = app;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
