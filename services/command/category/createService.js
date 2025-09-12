const categoryBuilder = require("../../../factories/category");

async function createCategory(name) {
    const category = await categoryBuilder(name);
    return await category.save();
}

module.exports = createCategory;