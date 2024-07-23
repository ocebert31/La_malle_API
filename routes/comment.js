const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const commentController = require('../controllers/comments');

router.post('/', auth, commentController.createComments);
router.get('/', commentController.getAllComments);
module.exports = router;