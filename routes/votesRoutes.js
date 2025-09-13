const express = require('express');
const router = express.Router();
const voteController = require('../controllers/votesController');
const auth = require('../middlewares/authenticate/authenticateJWT');
const authenticated = require('../middlewares/permissions/requireAuth');

router.post('/', auth, authenticated, voteController.createVote);

module.exports = router;