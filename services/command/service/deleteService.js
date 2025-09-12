const Service = require("../../../models/services")
const { assert } = require("../../../utils/errorHandler")
const isAuthorOfCreationOrAdmin = require("../../../utils/validators/isAuthorOfCreationOrAdmin")
const fs = require('fs/promises');

async function deleteService(req) {
    const serviceId = req.params.id;
    const service = await Service.findById(serviceId);
    assert(!service, 'Service non trouvé', 404 )
    isAuthorOfCreationOrAdmin(service, req.auth)
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