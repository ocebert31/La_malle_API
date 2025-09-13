const Contact = require("../models/contact");
const assert = require("../validations/assert");

async function contactFactory(data) {
    const contactData = {
        name: data.name,
        firstName: data.firstName,
        email: data.email,
        phone: data.phone,
        description: data.description,
        typeRequest: data.typeRequest,
        desiredDate: data.desiredDate,
        urgence: data.urgence,
        status: data.status || 'En attente',
        rgpd: data.rgpd,
    };
    assert(contactData.rgpd === false, 'Vous devez accepter le traitement des données.', 400);
    return new Contact(contactData);
}

module.exports = contactFactory;
