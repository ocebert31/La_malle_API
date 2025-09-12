const asyncHandler = require('../middlewares/asyncHandler');
const createService = require("../services/command/category/createService")
const updateService = require("../services/command/category/updateService")
const deleteService = require("../services/command/category/deleteService")
const getAllService = require("../services/query/category/getAllService")

exports.createCategory = asyncHandler(async (req, res) => {
    const categories = await createService(req.body.name);
    res.status(201).json({ message: 'Catégorie ajoutée avec succès', categories });
});

exports.getAllCategories = asyncHandler(async (req, res) => {
    const categories = await getAllService();
    res.status(200).json(categories);
});

exports.deleteCategory = asyncHandler(async (req, res) => {
    await deleteService(req.params.id);
    res.status(200).json({ message: 'Catégorie supprimée avec succès' });
});

exports.updateCategory = asyncHandler(async (req, res) => {
    const updatedCategory = await updateService(req.params.id, req.body.name);
    res.status(200).json({ message: 'Catégorie mise à jour avec succès', category: updatedCategory });
});