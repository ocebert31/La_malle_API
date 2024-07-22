const bcrypt = require('bcrypt');
const User = require('../models/users');

async function createAdminUser() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD ;

    try {
        const adminExists = await User.findOne({ email: adminEmail });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            const adminUser = new User({
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            });

            await adminUser.save();
            console.log("L'admin a été créé");
        } else {
            console.log("L'admin existe déjà");
        }
    } catch (error) {
        console.error(error);
    }
}

module.exports = createAdminUser;
