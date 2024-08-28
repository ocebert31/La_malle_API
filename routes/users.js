const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const authenticated = require('../middlewares/authenticated');
const auth = require('../middlewares/auth');

router.post('/registration', userController.registration);
router.post('/session', userController.session);
router.post('/confirmation/:token', userController.confirmation);
router.put('/avatar-options', auth, authenticated, userController.updateAvatarOptions);

module.exports = router;