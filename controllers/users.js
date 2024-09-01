const bcrypt = require('bcrypt');
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
const { sendConfirmationEmail } = require('../utils/sendConfirmationEmail');
const crypto = require('crypto');
const { sendConfirmationUpdateEmail } = require('../utils/sendConfirmationUpdateEmail');

exports.registration = (req, res, next) => {
    const { email } = req.body;

    if (!email || email.trim() === '') {
        return res.status(400).json({ message: 'L\'email est requis.' });
    }

    User.findOne({ $or: [
        { email: email },
        { newEmail: email }
    ] })
        .then(existingUser => {

            if (existingUser) {
               return res.status(400).json({ message: 'Cet email est déjà utilisé' });
            }  
            if (passwordTooShort(req.body.password)) {
                return res.status(400).json({ message: 'Le mot de passe doit comporter au moins 6 caractères' });
            } 
            bcrypt.hash(req.body.password, 10)
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
                        .then(() => sendConfirmationEmail(user))
                        .then((info, error) => {
                            res.status(201).json({ message: 'Utilisateur créé !' })
                        })
                        .catch(error => {res.status(400).json({ error })});
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

        const verifyUniqueEmail = awaitUser.findOne({ $or: [
            { email: newEmail },
            { newEmail: newEmail }
        ] });

        if (verifyUniqueEmail) {
            return res.status(400).json({ message: 'Cette adresse e-mail est déjà utilisée.' });
        }

        const confirmationToken = crypto.randomBytes(20).toString('hex');
        user.confirmationToken = confirmationToken;
        user.newEmail = newEmail;

        await user.save();
        await sendConfirmationUpdateEmail(user, confirmationToken);

        res.status(200).json({ message: 'Un e-mail de confirmation a été envoyé à votre nouvelle adresse.' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'adresse e-mail:', error); 
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'adresse e-mail.', error: error.message });
    }
}
