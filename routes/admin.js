const express = require('express');
const router = express.Router();
const adminController = require('../controllers/users');
const authenticated = require('../middlewares/requireAuth');
const auth = require('../middlewares/authenticateJWT');
const statController = require('../controllers/stat');
const requireAdmin = require("../middlewares/requireAdmin")

router.get('/', auth, authenticated, requireAdmin, adminController.getAllUser);
router.put('/:id', auth, authenticated, requireAdmin, adminController.updateUserRole);
router.get('/stat-monthly', auth, authenticated, requireAdmin, statController.getMonthlyStats);
router.delete('/:id', auth, authenticated, requireAdmin, adminController.deleteUserByAdmin);

module.exports = router;