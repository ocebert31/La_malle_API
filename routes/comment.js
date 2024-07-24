const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const commentController = require('../controllers/comments');

router.post('/', auth, commentController.createComments);
router.get('/', commentController.getAllComments);
router.put('/:id', auth, commentController.updateComment);
router.delete('/:id', auth, commentController.deleteComment);

module.exports = router;