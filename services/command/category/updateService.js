const assert = require("../../../validations/assert")
const categoryFactory = require("../../../factories/categoryFactory");
const Category = require('../../../models/categories');
const validate = require("../../../validations/validate")
const { updateCategoryValidation } = require("../../../validations/categoryValidation");

async function updateService(id, name) {
    const category = await Category.findById(id);
    assert(!category, 'Catégorie non trouvée', 404)
    validate(updateCategoryValidation, { name });
    const updateData = await categoryFactory(name, { forUpdate: true });
    category.set(updateData);
    return await category.save();
}

module.exports = updateService;