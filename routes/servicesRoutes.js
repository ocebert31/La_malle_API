const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/servicesController');
const uploadImage = require('../middlewares/uploadImage');
const auth = require('../middlewares/authenticate/authenticateJWT');
const authenticated = require('../middlewares/permissions/requireAuth');
const requireAdminOrAuthor = require("../middlewares/permissions/requireAdminOrAuthor")

router.post('/', auth, authenticated, requireAdminOrAuthor, uploadImage.single('image'), serviceController.createService);
router.get('/', auth, serviceController.getAllServices);
router.get('/:id', auth, serviceController.getOneService);
router.put('/:id', auth, authenticated, uploadImage.single('image'), serviceController.updateService);
router.delete('/:id', auth, authenticated, serviceController.deleteService);

module.exports = router;


