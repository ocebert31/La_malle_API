const createService = require("../services/command/contact/createService")
const updateServiceStatus = require("../services/command/contact/updateServiceStatus")
const getAllServices = require("../services/query/contact/getAllServices")
const asyncHandler = require("express-async-handler");
const messages = require("../utils/messages/contact")

exports.createContact = asyncHandler(async (req, res) => {
    const newContact = await createService(req.body);
    res.status(201).json({ message: messages.CONTACT_CREATED, contact: newContact });
});

exports.getAllContacts = asyncHandler(async (req, res) => {
    const contactsData = await getAllServices(req.query);
    res.status(200).json(contactsData);
});

exports.updateContactStatus = asyncHandler(async (req, res) => {
    const updatedContact = await updateServiceStatus(req.params.id, req.body.status);
    res.status(200).json({ message: messages.CONTACT_STATUS_UPDATED, contact: updatedContact });
});
