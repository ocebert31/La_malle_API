const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/services');
const uploadImage = require('../middlewares/uploadImage');
const auth = require('../middlewares/auth');
const authenticated = require('../middlewares/authenticated');

router.post('/', auth, authenticated ,uploadImage.single('image'), serviceController.createService);
router.get('/', auth, serviceController.getAllServices);
router.get('/:id', auth, serviceController.getOneService);
router.put('/:id', auth, authenticated, uploadImage.single('image'), serviceController.updateService);
router.delete('/:id', auth, authenticated, serviceController.deleteService);

module.exports = router;


