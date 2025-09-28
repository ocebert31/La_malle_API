const serviceFactory = require("../../../factories/serviceFactory");
const validate = require("../../../validations/validate")
const { createServiceValidation } = require("../../../validations/serviceValidation");

async function createService(req) {
    validate( createServiceValidation, 
        {   
            title: req.body.title, 
            content: req.body.content, 
            tags: req.body.tags,
            categoryId: req.body.categoryId, 
            price: req.body.price, 
            imageUrl: req.body.imageUrl,
        }
    );
    const service = await serviceFactory(req)
    const savedService = await service.save();
    return savedService;
}

module.exports = createService;