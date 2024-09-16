const bcrypt = require('bcrypt');
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
const { sendConfirmationEmail } = require('../utils/sendConfirmationEmail');
const crypto = require('crypto');

exports.registration = (req, res, next) => {
    const { email, password, confirmPassword } = req.body;

    if (!email || email.trim() === '') {
        return res.status(400).json({ message: 'L\'email est requis.' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Veuillez indiquer la bonne confirmation de mot de passe" });
    }

    User.findOne({ $or: [
        { email: email },
        { newEmail: email }
    ] })
        .then(existingUser => {
            if (existingUser) {
               return res.status(400).json({ message: 'Cet email est déjà utilisé' });
            }
            if (passwordTooShort(password)) {
                return res.status(400).json({ message: 'Le mot de passe doit comporter au moins 6 caractères' });
            }
            bcrypt.hash(password, 10)
                .then(hash => {
                    const pseudo = uniqueNamesGenerator({
                        dictionaries: [colors, adjectives, animals],
                        length: 3,
                        separator: '_'
                    });
                    const confirmationToken = crypto.randomBytes(20).toString('hex')
                    const user = new User({
                        newEmail: email,
                        password: hash,
                        pseudo: pseudo,
                        confirmationToken,
                    });
                    user.save()
                        .then(() => sendConfirmationEmail(user, 'signup'))
                        .then((info, error) => {
                            res.status(201).json({ message: 'Utilisateur créé !' })
                        })
                        .catch(error => { res.status(400).json({ error })});
                })
                .catch(error => {res.status(500).json({ error })
        });
    })
    .catch(error => res.status(500).json({ error }));
};

const passwordTooShort = (password) => {
    return password.length < 6;
};

exports.session = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            if (user.confirmationToken) {
                return res.status(403).json({ message: 'Veuillez confirmer votre email avant de vous connecter.' });
            }

            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        user: user,
                        token: jwt.sign(
                            { userId: user._id, role: user.role, pseudo: user.pseudo },
                            process.env.AUTH_TOKEN,
                            { expiresIn: '24h' },
                        )
                    });
                })
        });
};

exports.confirmation = (req, res) => {
    const { token } = req.params;

    User.findOne({ confirmationToken: token })
        .then(user => {
            if (!user) {
                return res.status(400).json({ message: 'Token invalide ou expiré.' });
            }
            const successMessage = user.email 
                ? 'Votre adresse e-mail a été mise à jour avec succès.' 
                : 'Compte confirmé avec succès.';

            const errorMessage = user.email 
                ? 'Erreur lors de la confirmation de l\'adresse e-mail.' 
                : 'Erreur lors de la confirmation du compte.';

            user.email = user.newEmail;
            user.newEmail = undefined;
            user.confirmationToken = undefined;
            user.save()
                .then(() => {
                    res.status(200).json({ message: successMessage, user });
                })
                .catch(error => {
                    res.status(500).json({ message: errorMessage, error: error.message });
                });
        })
        .catch(error => res.status(500).json({ message: 'Erreur lors de la confirmation.', error: error.message }));
};


exports.updateAvatarOptions = (req, res) => {
    const userId = req.auth.userId;
    const avatarOptions = req.body.avatarOptions;

    User.findByIdAndUpdate(
        userId,  
        { avatarOptions },  
        { new: true } 
    )
    .then(user => {
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.status(200).json({ message: 'Options d\'avatar mises à jour', user });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.updateEmail = async (req, res) => {
    const { newEmail, currentPassword } = req.body;
    try {
        if (!newEmail || newEmail.trim() === '') {
            return res.status(400).json({ message: 'L\'email est requis.' });
        }
        const user = await User.findById(req.auth.userId);
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Mot de passe incorrect.' });
        }

        const verifyUniqueEmail = await User.findOne({ $or: [
            { email: newEmail },
            { newEmail: newEmail }
        ] });

        if (verifyUniqueEmail) {
            return res.status(400).json({ message: 'Cette adresse e-mail est déjà utilisée.' });
        }

        user.confirmationToken = crypto.randomBytes(20).toString('hex');
        
        user.newEmail = newEmail;

        await user.save();
        await sendConfirmationEmail(user, 'update');

        res.status(200).json({ message: 'Un e-mail de confirmation a été envoyé à votre nouvelle adresse.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'adresse e-mail.', error: error.message });
    }
}

exports.updatePassword = async (req, res) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json({ message: 'Veuillez fournir tous les champs requis : mot de passe actuel, nouveau mot de passe, et confirmation du nouveau mot de passe.' });
    }

    if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: 'Le nouveau mot de passe et la confirmation ne correspondent pas.' });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Le nouveau mot de passe doit comporter au moins 6 caractères.' });
    }

    try {
        const user = await User.findById(req.auth.userId);

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mot de passe actuel incorrect.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
       
        await user.save();

        res.status(200).json({ message: 'Mot de passe mis à jour avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour du mot de passe.', error: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "L'adresse e-mail est requise." });
    }

    try {
        
        const user = await User.findOne({ email});
        if (!user) {
            return res.status(400).json({ message: "Utilisateur non trouvé." });
        }
        
        user.confirmationToken = crypto.randomBytes(20).toString('hex');
        await user.save();

        await sendConfirmationEmail(user, 'forgotPassword');

        res.status(200).json({ message: "Un e-mail de réinitialisation a été envoyé." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la demande de réinitialisation du mot de passe.", error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword, confirmNewPassword } = req.body;

    if (!newPassword || !confirmNewPassword) {
        return res.status(400).json({ message: "Veuillez fournir le nouveau mot de passe et sa confirmation." });
    }
    if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: "Les mots de passe ne correspondent pas." });
    }
    try {
        const user = await User.findOne({
            confirmationToken: token,
        });

        if (!user) {
            return res.status(400).json({ message: "Le token est invalide ou expiré." });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.confirmationToken = undefined;

        await user.save();
        res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la réinitialisation du mot de passe.", error: error.message });
    }
};

exports.getAllUser = (req, res) => {
    const { page = 1, limit = 20, searchQuery = '' } = req.query;
    const currentPage = parseInt(page, 10);
    const usersLimit = parseInt(limit, 10);
    const skip = (currentPage - 1) * usersLimit;

    const searchFilter = searchQuery
        ? { $or: [ 
            { pseudo: { $regex: searchQuery, $options: 'i' } }, 
            { email: { $regex: searchQuery, $options: 'i' } }
          ] }
        : {};

    User.find(searchFilter)
        .skip(skip)
        .limit(usersLimit)
        .then(users => {res.status(200).json({page: currentPage, limit: usersLimit, users});})
        .catch(error => res.status(400).json({ error }));
};

exports.updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        if (!['author', 'reader', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Rôle invalide' });
        }
        const user = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.json(user);
        console.log(user)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
};

exports.userData = async (req, res) => {
    try {
        const user = await User.findById(req.auth.userId).select('-password'); 
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};