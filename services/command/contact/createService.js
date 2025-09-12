const contactBuilder = require('../../../factories/contact');
const { contactEmail } = require("../../../mail/contactEmail");

async function createContact(data) {
    const newContact = await contactBuilder(data);
    await newContact.save();
    await contactEmail(newContact);
    return newContact;
}

module.exports = createContact;