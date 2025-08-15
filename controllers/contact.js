const { contactEmail } = require('../utils/contactEmail');
const Contact = require('../models/contact'); 

exports.createRequest = async (req, res) => {
    const { name, firstName, email, phone, description, typeRequest, desiredDate, urgence, rgpd } = req.body;
    if (rgpd !== true) return res.status(400).json({ message: 'Vous devez accepter le traitement des données.' });
    try {
        const newDemande = new Contact({
            name, 
            firstName, 
            email,
            phone, 
            description, 
            typeRequest, 
            desiredDate, 
            urgence, 
            rgpd
        });
        await newDemande.save();
        await contactEmail(newDemande);
        res.status(200).json({ message: 'Demande enregistrée et mail envoyé avec succès' });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de l’enregistrement ou de l’envoi', error: err });
    }
};
