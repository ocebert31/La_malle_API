const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articles');
const uploadImage = require('../middlewares/uploadImage');

router.post('/', uploadImage.single('image'), articleController.createArticle);
router.get('/',articleController.getAllArticles);
router.get('/:id',articleController.getOneArticle);
router.delete('/:id', articleController.deleteArticle);

module.exports = router;