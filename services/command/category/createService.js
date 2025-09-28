const categoryFactory = require("../../../factories/categoryFactory");
const validate = require("../../../validations/validate")
const { createCategoryValidation } = require("../../../validations/categoryValidation");

async function createService(name) {
    validate(createCategoryValidation, { name });
    const category = await categoryFactory(name);
    return await category.save();
}

module.exports = createService;