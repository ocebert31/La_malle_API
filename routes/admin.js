const express = require('express');
const router = express.Router();
const adminController = require('../controllers/users');
const authenticated = require('../middlewares/authenticated');
const auth = require('../middlewares/auth');

router.get('/', auth, authenticated, adminController.getAllUser);
router.put('/:id', auth, authenticated, adminController.updateUserRole);

module.exports = router;