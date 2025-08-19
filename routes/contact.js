const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact');
const authenticated = require('../middlewares/authenticated');
const auth = require('../middlewares/auth');

router.post('/', auth, contactController.createRequest);
router.get('/', auth, authenticated, contactController.getAllRequests);
router.put('/status/:id', auth, authenticated, contactController.updateRequestStatus);

module.exports = router;
