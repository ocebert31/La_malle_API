const Category = require('../../../models/categories');

async function getAllCategories() {
    return await Category.find();
}

module.exports = getAllCategories;