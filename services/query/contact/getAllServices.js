const Contact = require('../../../models/contact');

async function getAllServices({ page = 1, limit = 10, searchQuery = '', urgency, status }) {
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

module.exports = getAllServices;
