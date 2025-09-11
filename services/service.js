const serviceBuilder = require("../factories/service");
const Service = require("../models/services")
const { validateAndFormatTags, isAuthorOfCreationOrAdmin, buildServiceUpdateData, buildServiceImageUpdate, removeOldServiceImage, servicesFilters, serviceFilters } = require("../utils/service")
const { assert } = require("../utils/errorHandler");
const { buildAllServicesAggregation, buildServiceAggregation } = require("../utils/aggregation/service");
const favorites = require("../models/favorites");
const mongoose = require('mongoose');

async function createService(req) {
    const service = await serviceBuilder(req)
    const savedService = await service.save();
    return savedService;
}

async function updateService(req) {
    const service = await Service.findById(req.params.id);
    assert(!service, 'Service non trouvé', 404 )
    isAuthorOfCreationOrAdmin(service, req.auth)
    const tags = await validateAndFormatTags(req.body.tags || []);
    const updateData = await buildServiceUpdateData(tags, req)
    const updateService = await buildServiceImageUpdate(req, service, updateData)
    return Service.findByIdAndUpdate(req.params.id, updateService, { new: true });
}

async function deleteService(req) {
    const serviceId = req.params.id;
    const service = await Service.findById(serviceId);
    assert(!service, 'Service non trouvé', 404 )
    isAuthorOfCreationOrAdmin(service, req.auth)
    await removeOldServiceImage(service)
    await Service.deleteOne({ _id: serviceId });
}

async function getAllServices(query, userId) {
    const { searchQuery = '', page = 1, limit = 20, type = 'all', categoryId } = query;
    const matchStage = await servicesFilters(searchQuery, type, categoryId, userId)
    const services = await buildAllServicesAggregation(matchStage, page, limit);
    return services;
}

async function getOneService(req) {
    const userId = req.auth?.userId ? new mongoose.Types.ObjectId(req.auth.userId) : null;
    const favorite = req.auth ? await favorites.findOne({ userId: req.auth.userId, serviceId: req.params.id }) : null;
    const matchStage = await serviceFilters(req.params.id)
    const services = await buildServiceAggregation(matchStage, req.params.id, userId)
    assert(!services.length, "Service non trouvé", 404)
    return { ...services[0], favorite };
}

module.exports = { createService, updateService, deleteService, getAllServices, getOneService }