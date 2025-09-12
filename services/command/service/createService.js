const serviceBuilder = require("../../../factories/service");

async function createService(req) {
    const service = await serviceBuilder(req)
    const savedService = await service.save();
    return savedService;
}

module.exports = createService;