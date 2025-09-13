const User = require('../models/users');
const secureHash = require("../utils/security/secureHash")

async function createAdminUser() {
    try {
        const adminExists = await User.findOne({ role: 'admin' });
        if (adminExists) {
            console.info("ℹ️ Un admin existe déjà. Aucune action automatique via .env");
            return;
        }
        const admin = await buildAdminFromEnv();
        await admin.save();
        console.log("✅ Admin créé avec succès !");
    } catch (error) {
        console.error("❌ Erreur lors de la création de l'admin :", error);
    }
}

async function buildAdminFromEnv() {
    const hashedPassword = await secureHash(process.env.ADMIN_PASSWORD);
    return new User({
        pseudo: 'Admin',
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
    });
}

module.exports = createAdminUser;
