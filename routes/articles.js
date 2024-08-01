const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articles');
const uploadImage = require('../middlewares/uploadImage');
const auth = require('../middlewares/auth');
const authenticated = require('../middlewares/authenticated');

router.post('/', auth, authenticated ,uploadImage.single('image'), articleController.createArticle);
router.get('/', auth, articleController.getAllArticles);
router.get('/:id', auth, articleController.getOneArticle);
router.put('/:id', auth, authenticated, uploadImage.single('image'), articleController.updateArticle);
router.delete('/:id', auth, authenticated, articleController.deleteArticle);

module.exports = router;


