const Contact = require('../../../models/contact');
const assert = require("../../../validations/assert");

async function updateContactStatus(id, status) {
    const updatedContact = await Contact.findByIdAndUpdate( id.trim(), { status }, { new: true } );
    assert(!updatedContact, 'Demande non trouvée', 404)
    return updatedContact;
}

module.exports = updateContactStatus