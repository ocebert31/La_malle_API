const assert = require("../../../validations/assert")
const Category = require('../../../models/categories');

async function deleteCategory(id) {
    const category = await Category.findById(id);
    assert(!category, 'Catégorie non trouvée', 404)
    await category.deleteOne();
}

module.exports = deleteCategory;