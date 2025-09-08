const categoryService = require('../services/category');
const asyncHandler = require('../middlewares/asyncHandler');

exports.createCategory = asyncHandler(async (req, res) => {
    const categories = await categoryService.createCategory(req.body.name);
    res.status(201).json({ message: 'Catégorie ajoutée avec succès', categories });
});

exports.getAllCategories = asyncHandler(async (req, res) => {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
});

exports.deleteCategory = asyncHandler(async (req, res) => {
    await categoryService.deleteCategory(req.params.id);
    res.status(200).json({ message: 'Catégorie supprimée avec succès' });
});

exports.updateCategory = asyncHandler(async (req, res) => {
    const updatedCategory = await categoryService.updateCategory(req.params.id, req.body.name);
    res.status(200).json({ message: 'Catégorie mise à jour avec succès', category: updatedCategory });
});