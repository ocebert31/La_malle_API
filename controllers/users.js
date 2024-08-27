const bcrypt = require('bcrypt');
const User = require('../models/users');
const jwt = require('jsonwebtoken');
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
const { sendConfirmationEmail } = require('../utils/sendConfirmationEmail');
const crypto = require('crypto');

exports.registration = (req, res, next) => {
    User.findOne({ email: req.body.email })
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
                        email: req.body.email,
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
                return res.status(400).json({ message: 'Token invalide ou expiré' });
            }
            user.confirmationToken = undefined;
            user.save()
                .then(() => {
                    res.status(200).json({ message: 'Compte confirmé avec succès' });
                })
                .catch(error => {
                    res.status(500).json({ error });
                });
        })
        .catch(error => res.status(500).json({ error }));
};