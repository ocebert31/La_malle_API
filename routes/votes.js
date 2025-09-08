const express = require('express');
const router = express.Router();
const voteController = require('../controllers/votes');
const auth = require('../middlewares/authenticateJWT');
const authenticated = require('../middlewares/requireAuth');

router.post('/', auth, authenticated, voteController.createVote);

module.exports = router;