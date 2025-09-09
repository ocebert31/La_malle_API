const Joi = require('joi');

const emailSchema = Joi.string().email().required().messages({
    "string.empty": "L'email est requis",
    "string.email": "L'email n'est pas valide"
});

const passwordSchema = Joi.string().min(6).required().messages({
    "string.empty": "Le mot de passe est requis",
    "string.min": "Le mot de passe doit contenir au moins 6 caractères"
});

const registrationSchema = Joi.object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        "any.only": "Les mots de passe ne correspondent pas",
        "string.empty": "La confirmation du mot de passe est requise"
    })
})

const sessionSchema = Joi.object({
    email: emailSchema,
    password: passwordSchema,
})

const updateEmailSchema = Joi.object({
    newEmail: emailSchema,
    currentPassword: passwordSchema,
})

const updatePasswordSchema = Joi.object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
        "any.only": "Les mots de passe ne correspondent pas",
        "string.empty": "La confirmation du mot de passe est requise"
    })
})

const forgotPasswordSchema = Joi.object({
    email: emailSchema,
})

const resetPasswordSchema = Joi.object({
    newPassword: passwordSchema,
    confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
        "any.only": "Les mots de passe ne correspondent pas",
        "string.empty": "La confirmation du mot de passe est requise"
    })
})

module.exports = { registrationSchema, sessionSchema, updateEmailSchema, updatePasswordSchema, forgotPasswordSchema, resetPasswordSchema };