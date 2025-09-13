const categoryFactory = require("../../../factories/categoryFactory");

async function createCategory(name) {
    const category = await categoryFactory(name);
    return await category.save();
}

module.exports = createCategory;