const contactService = require('../services/contact');
const asyncHandler = require('../middlewares/asyncHandler');

exports.createContact = asyncHandler(async (req, res) => {
    const newContact = await contactService.createContact(req.body);
    res.status(201).json({ message: 'Demande enregistrée et mail envoyé avec succès', contact: newContact });
});

exports.getAllContacts = asyncHandler(async (req, res) => {
    const contactsData = await contactService.getAllContacts(req.query);
    res.status(200).json(contactsData);
});

exports.updateContactStatus = asyncHandler(async (req, res) => {
    const updatedContact = await contactService.updateContactStatus(req.params.id, req.body.status);
    res.status(200).json({ message: 'Statut mis à jour', contact: updatedContact });
});
