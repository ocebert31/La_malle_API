const Contact = require('../../../models/contact');
const assert = require("../../../validations/assert");
const validate = require("../../../validations/validate")
const { updateStatusValidation } = require("../../../validations/contactValidation");

async function updateServiceStatus(id, status) {
    validate( updateStatusValidation, { status })
    const updatedContact = await Contact.findByIdAndUpdate( id.trim(), { status }, { new: true } );
    assert(!updatedContact, 'Demande non trouvée', 404)
    return updatedContact;
}

module.exports = updateServiceStatus