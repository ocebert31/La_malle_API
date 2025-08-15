const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact');
const auth = require('../middlewares/auth');

router.post('/', auth, contactController.createRequest);

module.exports = router;
