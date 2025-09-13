const Service = require("../../../models/services")
const { assert } = require("../../../utils/errorHandler")
const fs = require('fs/promises');

async function deleteService(req) {
  const serviceId = req.params.id;
  const service = await Service.findById(serviceId);
  assert(!service, 'Service non trouvé', 404 )
  assert(service.userId.toString() !== req.auth.userId.toString() && req.auth.role !== 'admin', "Seul l'auteur de cette création ou l'admin ont ce droit d'accès", 401)
  await removeOldServiceImage(service)
  await Service.deleteOne({ _id: serviceId });
}

async function removeOldServiceImage(service) {
  if (service.imageUrl) {
    const oldFile = service.imageUrl.split('/images/')[1];
    await fs.unlink(`images/${oldFile}`).catch(() => {});
  }
}

module.exports = deleteService;