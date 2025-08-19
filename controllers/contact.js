const { contactEmail } = require('../utils/contactEmail');
const Contact = require('../models/contact'); 

exports.createRequest = async (req, res) => {
    const { name, firstName, email, phone, description, typeRequest, desiredDate, urgence, status, rgpd } = req.body;
    if (rgpd !== true) return res.status(400).json({ message: 'Vous devez accepter le traitement des données.' });
    try {
        const newRequest = new Contact({
            name, 
            firstName, 
            email,
            phone, 
            description, 
            typeRequest, 
            desiredDate, 
            urgence, 
            status,
            rgpd
        });
        await newRequest.save();
        await contactEmail(newRequest);
        res.status(200).json({ message: 'Demande enregistrée et mail envoyé avec succès' });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de l’enregistrement ou de l’envoi', error: err });
    }
};

exports.getAllRequests = async (req, res) => {
    const { page = 1, limit = 10, searchQuery = '', urgency, status } = req.query;
    const currentPage = parseInt(page, 10);
    const requestsLimit = parseInt(limit, 10);
    const skip = (currentPage - 1) * requestsLimit;
    try {
        const requests = await Contact.find(buildSearchFilterRequest(searchQuery, urgency, status))
            .skip(skip)
            .limit(requestsLimit);
        res.status(200).json({ page: currentPage, limit: requestsLimit, requests});
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération des demandes', error: err });
    }
};

function buildSearchFilterRequest(searchQuery, urgency, status) {
    const filter = {};
    if (searchQuery) {
        filter.$or = [
            { email: { $regex: searchQuery, $options: 'i' } },
            { phone: { $regex: searchQuery, $options: 'i' } }
        ];
    }
    if (urgency) {
        filter.urgence = urgency;
    }
    if (status) {
        filter.status = status;
    }
    return filter;
}

exports.updateRequestStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const trimmedId = id.trim(); 
    if (!['En attente', 'Acceptée', 'Rejetée', 'En cours'].includes(status)) {
        return res.status(400).json({ message: 'Statut invalide' });
    }
    try {
        const updatedRequest = await Contact.findByIdAndUpdate(
            trimmedId,
            { status },
            { new: true }
        );
        if (!updatedRequest) return res.status(404).json({ message: 'Demande non trouvée' });
        res.status(200).json({ message: 'Statut mis à jour', request: updatedRequest });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du statut', error: err });
    }
};
