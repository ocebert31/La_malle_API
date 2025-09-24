const contactFactory = require('../../../factories/contactFactory');
const sendContactService = require("./sendContactService")

async function createContact(data) {
    const newContact = await contactFactory(data);
    await newContact.save();
    await sendContactService(newContact);
    return newContact;
}

module.exports = createContact;