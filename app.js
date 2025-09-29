require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const mongoose = require('mongoose');
const servicesRoutes = require('./routes/servicesRoutes');
const path = require('path');
const errorHandler = require('./middlewares/upload/errorHandler');
const usersRoutes = require('./routes/usersRoutes');
const createAdmin = require('./config/initializeAdmin')
const commentsRoutes = require('./routes/commentsRoutes');
const votesRoutes = require('./routes/votesRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');
const adminRoutes = require('./routes/adminRoutes')
const categoriesRoutes = require('./routes/categoriesRoutes')
const contactRoutes = require('./routes/contactsRoutes')
const cors = require('cors');

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.CONNECT_MONGO_DB);
    console.log('Connexion à MongoDB réussie !');
    await createAdmin();
    await removeUserEmailIndex();
  } catch (error) {
    console.error('Connexion à MongoDB échouée !', error);
  }
}

async function removeUserEmailIndex() {
  const User = mongoose.model('User');
  // try {
  //   await User.collection.dropIndex({ email: 1 });
  //   console.log('Index supprimé avec succès');
  // } catch (error) {
  //   console.error('Erreur lors de la suppression de l\'index:', error);
  // }

  try {
    await User.collection.dropIndex({ email: 1 });
    console.log("Index { email: 1 } supprimé.");
  } catch (err) {
    if (err.code === 27) {
      console.log("ℹ️ Aucun index { email: 1 } à supprimer, on continue...");
    } else {
      console.error("Erreur lors de la suppression de l'index:", err);
    }
  }

}



connectToMongoDB(); 

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/services', servicesRoutes);
app.use('/auth', usersRoutes);
app.use('/comments', commentsRoutes);
app.use('/votes', votesRoutes);
app.use('/favorites', favoritesRoutes);
app.use('/admin', adminRoutes);
app.use('/categories', categoriesRoutes);
app.use('/contact', contactRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Erreur serveur"
  });
});

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(errorHandler);

module.exports = app;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
