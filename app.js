const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const mongoose = require('mongoose');
const articlesRoutes = require('./routes/articles');
const path = require('path');
const errorHandler = require('./middlewares/errorHandler');
const usersRoutes = require('./routes/users');
require('dotenv').config()
const createAdmin = require('./config/initAdmin')
const commentsRoutes = require('./routes/comment');
const votesRoutes = require('./routes/votes');
const favoritesRoutes = require('./routes/favorites');
const adminRoutes = require('./routes/admin')
const categoriesRoutes = require('./routes/categories')

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
    try {
        await User.collection.dropIndex({ email: 1 });
        console.log('Index supprimé avec succès');
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'index:', error);
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

app.use('/articles', articlesRoutes);
app.use('/auth', usersRoutes);
app.use('/comments', commentsRoutes);
app.use('/votes', votesRoutes);
app.use('/favorites', favoritesRoutes);
app.use('/admin', adminRoutes);
app.use('/categories', categoriesRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(errorHandler);

module.exports = app;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
