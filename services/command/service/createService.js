const serviceFactory = require("../../../factories/serviceFactory");

async function createService(req) {
    const service = await serviceFactory(req)
    const savedService = await service.save();
    return savedService;
}

module.exports = createService;