const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories');
const authenticated = require('../middlewares/authenticated');
const auth = require('../middlewares/auth');

router.post('/', auth, authenticated, categoriesController.createCategory);
router.get('/', auth, authenticated, categoriesController.getAllCategories);
router.delete('/:id', auth, authenticated, categoriesController.deleteCategory);
router.put('/:id', auth, authenticated, categoriesController.updateCategory);

module.exports = router;