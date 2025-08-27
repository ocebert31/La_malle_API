const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact');
const authenticated = require('../middlewares/authenticated');
const auth = require('../middlewares/auth');

router.post('/', auth, contactController.createContact);
router.get('/', auth, authenticated, contactController.getAllContacts);
router.put('/status/:id', auth, authenticated, contactController.updateContactStatus);

module.exports = router;
