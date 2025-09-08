const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact');
const authenticated = require('../middlewares/requireAuth');
const auth = require('../middlewares/authenticateJWT');
const requireAdmin = require("../middlewares/requireAdmin")

router.post('/', auth, contactController.createContact);
router.get('/', auth, authenticated, requireAdmin, contactController.getAllContacts);
router.put('/status/:id', auth, authenticated, requireAdmin, contactController.updateContactStatus);

module.exports = router;
