const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authenticate/authenticateJWT');
const commentController = require('../controllers/commentsController');
const authenticated = require('../middlewares/permissions/requireAuth');

router.post('/', auth, authenticated, commentController.createComment);
router.get('/', auth, commentController.getAllComments);
router.put('/:id', auth, authenticated, commentController.updateComment);
router.delete('/:id', auth, authenticated, commentController.deleteComment);

module.exports = router;