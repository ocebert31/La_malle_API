const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');

router.post('/registration', userController.registration);
router.post('/session', userController.session);
router.post('/confirmation/:token', userController.confirmation);

module.exports = router;