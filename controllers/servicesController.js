const asyncHandler = require("express-async-handler");
const createService = require("../services/command/service/createService")
const updateService = require("../services/command/service/updateService")
const deleteService = require("../services/command/service/deleteService")
const getAllServices = require("../services/query/service/getAllServices")
const getOneService = require("../services/query/service/getOneService")

exports.createService = asyncHandler(async (req, res) => {
    const service = await createService(req);
    return res.status(201).json({ service: service });
});

exports.updateService = asyncHandler(async (req, res) => {
    const updatedService = await updateService(req);
    res.status(200).json({ service: updatedService });
});

exports.deleteService = asyncHandler(async (req, res) => {
    const deletedService = await deleteService(req);
    res.status(200).json({ service: deletedService });
});

exports.getAllServices = asyncHandler(async (req, res) => {
    const services = await getAllServices(req.query, req.auth?.userId);
    res.status(200).json(services);
});

exports.getOneService = asyncHandler(async (req, res) => {
    const service = await getOneService(req);
    res.status(200).json(service);
});