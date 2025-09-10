const Contact = require('../models/contact');
const { contactEmail } = require('../mail/contactEmail');
const {assert} = require("../utils/errorHandler")

async function createContact(data) {
    assert(data.rgpd !== true, 'Vous devez accepter le traitement des données.', 400)
    const newContact = new Contact(data);
    await newContact.save();
    await contactEmail(newContact);
    return newContact;
}

async function getAllContacts({ page = 1, limit = 10, searchQuery = '', urgency, status }) {
    const currentPage = parseInt(page, 10);
    const contactsLimit = parseInt(limit, 10);
    const skip = (currentPage - 1) * contactsLimit;
    const filter = buildSearchFilter(searchQuery, urgency, status);
    const contacts = await Contact.find(filter)
        .skip(skip)
        .limit(contactsLimit);

    return { page: currentPage, limit: contactsLimit, contacts };
}

function buildSearchFilter(searchQuery, urgency, status) {
    const filter = {};
    if (searchQuery) {
        filter.$or = [
            { email: { $regex: searchQuery, $options: 'i' } },
            { phone: { $regex: searchQuery, $options: 'i' } },
        ];
    }
    if (urgency) filter.urgence = urgency;
    if (status) filter.status = status;
    return filter;
}

async function updateContactStatus(id, status) {
    const allowedStatuses = ['En attente', 'Acceptée', 'Rejetée', 'En cours'];
    assert(!allowedStatuses.includes(status), 'Statut invalide', 400)
    const updatedContact = await Contact.findByIdAndUpdate( id.trim(), { status }, { new: true } );
    assert(!updatedContact, 'Demande non trouvée', 404)
    return updatedContact;
}

module.exports = { createContact, getAllContacts, updateContactStatus };
