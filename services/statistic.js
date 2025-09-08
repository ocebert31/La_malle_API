const Contact = require('../models/contact');

async function getMonthlyStats() {
    const stats = await Contact.aggregate([
        {
        $group: {
            _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
            },
            demandes: { $sum: 1 },
            prestations: {
            $sum: {
                $cond: [{ $eq: ["$status", "Acceptée"] }, 1, 0]
            }
            }
        }
        },
        {
        $project: {
            year: "$_id.year",
            month: "$_id.month",
            demandes: 1,
            prestations: 1,
        }
        },
        { $sort: { year: 1, month: 1 } }
    ]);
    const stat = stats.map(s => ({
        mois: `${s.month}/${s.year}`,
        demandes: s.demandes,
        prestations: s.prestations,
    }));
    return stat;
}

module.exports = { getMonthlyStats };
