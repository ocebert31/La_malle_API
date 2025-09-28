const contactFactory = require('../../../factories/contactFactory');
const sendContactService = require("./sendContactService")
const validate = require("../../../validations/validate")
const { createContactValidation } = require("../../../validations/contactValidation");

async function createService(data) {
    validate( createContactValidation, 
        {   
            name: data.name, 
            firstName: data.firstName, 
            email: data.email,
            phone: data.phone, 
            description: data.description, 
            typeRequest: data.typeRequest,
            desiredDate: data.desiredDate, 
            urgence: data.urgence,  
            rgpd: data.rgpd
        }
    );
    const newContact = await contactFactory(data);
    await newContact.save();
    await sendContactService(newContact);
    return newContact;
}

module.exports = createService;