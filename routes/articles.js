const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articles');
const uploadImage = require('../middlewares/uploadImage');
const auth = require('../middlewares/auth');

router.post('/',auth ,uploadImage.single('image'), articleController.createArticle);
router.get('/',articleController.getAllArticles);
router.get('/:id',articleController.getOneArticle);
router.put('/:id',auth ,uploadImage.single('image'), articleController.modifyArticle);
router.delete('/:id',auth ,articleController.deleteArticle);

module.exports = router;