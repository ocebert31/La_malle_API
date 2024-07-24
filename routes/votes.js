const express = require('express');
const router = express.Router();
const voteController = require('../controllers/votes');
const auth = require('../middlewares/auth');
const authenticated = require('../middlewares/authenticated');

router.post('/', auth, authenticated, voteController.createVote);

module.exports = router;