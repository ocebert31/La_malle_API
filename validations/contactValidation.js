const Joi = require('joi');

const baseContactValidation = {
      name: Joi.string().trim().min(2).required().messages({
        "string.base": "Le nom doit être une chaîne de caractères",
        "string.empty": "Le nom est requis",
        "string.min": "Le nom doit contenir au moins 2 caractères",
        "any.required": "Le nom est obligatoire",
    }),

    firstName: Joi.string().trim().min(2).required().messages({
        "string.base": "Le prénom doit être une chaîne de caractères",
        "string.empty": "Le prénom est requis",
        "string.min": "Le prénom doit contenir au moins 2 caractères",
        "any.required": "Le prénom est obligatoire",
    }),

    email: Joi.string().email().required().messages({
        "string.email": "L'adresse e-mail doit être valide",
        "string.empty": "L'e-mail est requis",
        "any.required": "L'e-mail est obligatoire",
    }),

    phone: Joi.string().pattern(/^[0-9+\- ]+$/) .messages({
        "string.pattern.base": "Le numéro de téléphone n'est pas valide",
    }),

    description: Joi.string().trim().allow("").messages({
        "string.base": "La description doit être une chaîne de caractères",
    }),

    typeRequest: Joi.string().trim().min(2).required().messages({
        "string.empty": "Le type de demande est requis",
        "any.required": "Le type de demande est obligatoire",
    }),

    desiredDate: Joi.date().greater('now').messages({
        "date.base": "La date souhaitée doit être une date valide",
        "date.greater": "La date souhaitée doit être dans le futur",
    }),

    urgence: Joi.string().valid('Faible', 'Moyenne', 'Élevée').default('Moyenne').messages({
        "any.only": "L'urgence doit être 'Faible', 'Moyenne' ou 'Élevée'",
    }),

    rgpd: Joi.boolean().valid(true).required().messages({
        "any.only": "Vous devez accepter le traitement des données",
        "any.required": "Le consentement RGPD est obligatoire",
    }),

    status: Joi.string().valid('En attente', 'Acceptée', 'Rejetée', 'En cours').required().messages({
        "any.required": "Le statut est obligatoire",
        "any.only": "Le statut doit être 'En attente', 'Acceptée', 'Rejetée' ou 'En cours'",
    }),
}

const createContactValidation = Joi.object({
    name: baseContactValidation.name,
    firstName: baseContactValidation.firstName,
    email: baseContactValidation.email,
    phone: baseContactValidation.phone,
    description: baseContactValidation.description,
    typeRequest: baseContactValidation.typeRequest,
    desiredDate: baseContactValidation.desiredDate,
    urgence: baseContactValidation.urgence,
    rgpd: baseContactValidation.rgpd

});

const updateStatusValidation = Joi.object({
    status: baseContactValidation.status
});


module.exports = { createContactValidation, updateStatusValidation };