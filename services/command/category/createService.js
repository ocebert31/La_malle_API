const categoryFactory = require("../../../factories/categoryFactory");

async function createService(name) {
    const category = await categoryFactory(name);
    return await category.save();
}

module.exports = createService;