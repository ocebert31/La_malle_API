const createService = require("../services/command/contact/createService")
const updateServiceStatus = require("../services/command/contact/updateServiceStatus")
const getAllService = require("../services/query/contact/getAllService")
const asyncHandler = require('../middlewares/asyncHandler');

exports.createContact = asyncHandler(async (req, res) => {
    const newContact = await createService(req.body);
    res.status(201).json({ message: 'Demande enregistrée et mail envoyé avec succès', contact: newContact });
});

exports.getAllContacts = asyncHandler(async (req, res) => {
    const contactsData = await getAllService(req.query);
    res.status(200).json(contactsData);
});

exports.updateContactStatus = asyncHandler(async (req, res) => {
    const updatedContact = await updateServiceStatus(req.params.id, req.body.status);
    res.status(200).json({ message: 'Statut mis à jour', contact: updatedContact });
});
