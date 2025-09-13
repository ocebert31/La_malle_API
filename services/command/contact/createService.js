const contactFactory = require('../../../factories/contactFactory');
const { contactEmail } = require("../../../mail/contactEmail");

async function createContact(data) {
    const newContact = await contactFactory(data);
    await newContact.save();
    await contactEmail(newContact);
    return newContact;
}

module.exports = createContact;