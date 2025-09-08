const express = require('express');
const router = express.Router();
const adminController = require('../controllers/users');
const authenticated = require('../middlewares/requireAuth');
const auth = require('../middlewares/authenticateJWT');
const statController = require('../controllers/stat');

router.get('/', auth, authenticated, adminController.getAllUser);
router.put('/:id', auth, authenticated, adminController.updateUserRole);
router.get('/stat-monthly', auth, authenticated, statController.getMonthlyStats);
router.delete('/:id', auth, authenticated, adminController.deleteUserByAdmin);

module.exports = router;