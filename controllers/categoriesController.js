const asyncHandler = require("express-async-handler");
const createService = require("../services/command/category/createService")
const updateService = require("../services/command/category/updateService")
const deleteService = require("../services/command/category/deleteService")
const getAllServices = require("../services/query/category/getAllServices")
const messages = require("../utils/messages/category");

exports.createCategory = asyncHandler(async (req, res) => {
    const categories = await createService(req.body.name);
    res.status(201).json({ message: messages.CATEGORY_CREATED, categories });
});

exports.getAllCategories = asyncHandler(async (req, res) => {
    const categories = await getAllServices();
    res.status(200).json(categories);
});

exports.deleteCategory = asyncHandler(async (req, res) => {
    await deleteService(req.params.id);
    res.status(200).json({ message: messages.CATEGORY_DELETED });
});

exports.updateCategory = asyncHandler(async (req, res) => {
    const updatedCategory = await updateService(req.params.id, req.body.name);
    res.status(200).json({ message: messages.CATEGORY_UPDATED, category: updatedCategory });
});