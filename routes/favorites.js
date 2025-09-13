const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authenticate/authenticateJWT');
const authenticated = require('../middlewares/permissions/requireAuth');
const favoriteController = require('../controllers/favorites')

router.post('/', auth, authenticated, favoriteController.createFavoriteService);

module.exports = router;