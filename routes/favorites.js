const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const authenticated = require('../middlewares/authenticated');
const favoriteController = require('../controllers/favorites')

router.post('/', auth, authenticated, favoriteController.createFavoriteService);

module.exports = router;