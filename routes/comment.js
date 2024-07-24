const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const commentController = require('../controllers/comments');
const authenticated = require('../middlewares/authenticated');

router.post('/', auth, authenticated, commentController.createComments);
router.get('/', auth, commentController.getAllComments);
router.put('/:id', auth, authenticated, commentController.updateComment);
router.delete('/:id', auth, authenticated, commentController.deleteComment);

module.exports = router;