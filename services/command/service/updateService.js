const Service = require("../../../models/services")
const assert = require("../../../validations/assert")
const serviceFactory = require("../../../factories/serviceFactory");
const validate = require("../../../validations/validate")
const { updateServiceValidation } = require("../../../validations/serviceValidation");

async function updateService(req) {
  const serviceId = req.params.id;
  validate( updateServiceValidation, 
    {   
      title: req.body.title, 
      content: req.body.content, 
      tags: req.body.tags,
      categoryId: req.body.categoryId, 
      price: req.body.price, 
    }
  );
  const service = await Service.findById(serviceId);
  assert(!service, "Service non trouvé", 404);
  assert(service.userId.toString() !== req.auth.userId.toString() && req.auth.role !== 'admin', "Seul l'auteur de cette création ou l'admin ont ce droit d'accès", 401)
  const updateData = await serviceFactory(req, { forUpdate: true });
  return Service.findByIdAndUpdate(req.params.id, updateData, { new: true });
}

module.exports = updateService;