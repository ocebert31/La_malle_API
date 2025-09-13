const Service = require("../../../models/services")
const assert = require("../../../validations/assert")
const serviceFactory = require("../../../factories/serviceFactory");

async function updateService(req) {
  const service = await Service.findById(req.params.id);
  assert(!service, "Service non trouvé", 404);
  assert(service.userId.toString() !== req.auth.userId.toString() && req.auth.role !== 'admin', "Seul l'auteur de cette création ou l'admin ont ce droit d'accès", 401)
  const updateData = await serviceFactory(req, { forUpdate: true });
  return Service.findByIdAndUpdate(req.params.id, updateData, { new: true });
}

module.exports = updateService;