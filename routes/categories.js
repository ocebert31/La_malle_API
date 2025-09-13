const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories');
const requireAuth = require('../middlewares/permissions/requireAuth');
const authenticateJWT = require('../middlewares/authenticate/authenticateJWT');
const requireAdmin = require('../middlewares/permissions/requireAdmin')

router.post('/', authenticateJWT, requireAuth, requireAdmin, categoriesController.createCategory);
router.get('/', authenticateJWT, categoriesController.getAllCategories);
router.delete('/:id', authenticateJWT, requireAuth, requireAdmin, categoriesController.deleteCategory);
router.put('/:id', authenticateJWT, requireAuth, requireAdmin, categoriesController.updateCategory);

module.exports = router;