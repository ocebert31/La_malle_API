const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact');
const authenticated = require('../middlewares/permissions/requireAuth');
const auth = require('../middlewares/authenticate/authenticateJWT');
const requireAdmin = require("../middlewares/permissions/requireAdmin")

router.post('/', auth, contactController.createContact);
router.get('/', auth, authenticated, requireAdmin, contactController.getAllContacts);
router.put('/status/:id', auth, authenticated, requireAdmin, contactController.updateContactStatus);

module.exports = router;
