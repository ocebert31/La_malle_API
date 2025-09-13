const assert = require("../../../validations/assert")
const categoryBuilder = require("../../../factories/category");
const Category = require('../../../models/categories');

async function updateCategory(id, name) {
    const category = await Category.findById(id);
    assert(!category, 'Catégorie non trouvée', 404)
    const updateData = await categoryBuilder(name, { forUpdate: true });
    category.set(updateData);
    return await category.save();
}

module.exports = updateCategory;