const bcrypt = require('bcrypt');
const User = require('../models/users');

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
                    const user = new User({
                        email: req.body.email,
                        password: hash
                    });
                    user.save()
                        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                        .catch(error => res.status(400).json({ error }));
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

const passwordTooShort = (password) => {
    return password.length < 6;
};
