const User = require('../models/users');

exports.purgeDeletedUsers = async () => {
    try {
        const threshold = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const result = await User.deleteMany({ deleted_at: { $lt: threshold } });
        console.log(`Purge des comptes supprimés : ${result.deletedCount} utilisateurs supprimés définitivement.`);
    } catch (error) {
        console.error("Erreur lors de la purge des utilisateurs supprimés :", error.message);
    }
};