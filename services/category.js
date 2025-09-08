const Category = require('../models/categories');

async function createCategory(name) {
    const category = new Category({ name });
    await category.save();
    return category;
}

async function getAllCategories() {
    return await Category.find();
}

async function findCategoryById(id) {
    const category = await Category.findById(id);
    if (!category) {
        const error = new Error('Catégorie non trouvée');
        error.status = 404;
        throw error;
    }
    return category;
}

async function updateCategory(id, name) {
    const category = await findCategoryById(id);
    category.name = name;
    return await category.save();
}

async function deleteCategory(id) {
    const category = await findCategoryById(id);
    await category.deleteOne();
}

module.exports = { createCategory, getAllCategories, updateCategory, deleteCategory };
