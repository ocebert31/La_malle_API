const bcrypt = require('bcrypt');
const User = require('../models/users');

async function createAdminUser() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD ;
    try {
        const adminExists = await User.findOne({ email: adminEmail });
        await initializeAdmin(adminExists, adminPassword, adminEmail)
    } catch (error) {
        console.error(error);
    }
}

async function initializeAdmin(adminExists, adminPassword, adminEmail) {
    if (!adminExists) {
        const adminUser = await buildAdminUser(adminPassword, adminEmail)
        await adminUser.save();
        console.log("L'admin a été créé");
    } else {
        console.log("L'admin existe déjà");
    }
}

async function buildAdminUser(adminPassword, adminEmail) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const adminUser = new User({
        email: adminEmail,
        password: hashedPassword,
        pseudo: 'Admin',
        role: 'admin'
    });
    return adminUser;
}

module.exports = createAdminUser;
