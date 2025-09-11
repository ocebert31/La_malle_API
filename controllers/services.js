const serviceService = require("../services/service")
const asyncHandler = require('../middlewares/asyncHandler');

exports.createService = asyncHandler(async (req, res) => {
    const service = await serviceService.createService(req);
    return res.status(201).json({ service: service });
});

exports.updateService = asyncHandler(async (req, res) => {
    const updatedService = await serviceService.updateService(req);
    res.status(200).json({ service: updatedService });
});

exports.deleteService = asyncHandler(async (req, res) => {
    const deletedService = await serviceService.deleteService(req);
    res.status(200).json({ service: deletedService });
});

exports.getAllServices = asyncHandler(async (req, res) => {
    const services = await serviceService.getAllServices(req.query, req.auth?.userId);
    res.status(200).json(services);
});

exports.getOneService = asyncHandler(async (req, res) => {
    const service = await serviceService.getOneService(req);
    res.status(200).json(service);
});