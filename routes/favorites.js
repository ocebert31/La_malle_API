const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authenticateJWT');
const authenticated = require('../middlewares/requireAuth');
const favoriteController = require('../controllers/favorites')

router.post('/', auth, authenticated, favoriteController.createFavoriteService);

module.exports = router;