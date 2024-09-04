const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const authenticated = require('../middlewares/authenticated');
const auth = require('../middlewares/auth');

router.post('/registration', userController.registration);
router.post('/session', userController.session);
router.post('/confirmation/:token', userController.confirmation);
router.put('/avatar-options', auth, authenticated, userController.updateAvatarOptions);
router.post('/update-email', auth, authenticated, userController.updateEmail);
router.post('/update-password', auth, authenticated, userController.updatePassword);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);

module.exports = router;