const Service = require('../models/services')
const Comment = require('../models/comments')
const User = require('../models/users');
const Contact = require('../models/contact');

exports.getAllStat = async (req, res) => {
    try {
        const servicesCount = await Service.countDocuments({});
        const commentsCount = await Comment.countDocuments({});
        const usersCount = await User.countDocuments({});
        res.status(200).json({ servicesCount, commentsCount, usersCount});
    } catch (error) {
        res.status(400).json({ error });
    }
};

exports.getMonthlyStats = async (req, res) => {
   try {
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
    const formatted = stats.map(s => ({
        mois: `${s.month}/${s.year}`,
        demandes: s.demandes,
        prestations: s.prestations,
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du calcul des statistiques" });
  }
}