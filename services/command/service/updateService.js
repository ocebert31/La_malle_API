const Service = require("../../../models/services")
const { assert } = require("../../../utils/errorHandler")
const isAuthorOfCreationOrAdmin = require("../../../utils/validators/isAuthorOfCreationOrAdmin")
const serviceBuilder = require("../../../factories/service");

async function updateService(req) {
  const service = await Service.findById(req.params.id);
  assert(!service, "Service non trouvé", 404);
  isAuthorOfCreationOrAdmin(service, req.auth);
  const updateData = await serviceBuilder(req, { forUpdate: true });
  return Service.findByIdAndUpdate(req.params.id, updateData, { new: true });
}

module.exports = updateService;