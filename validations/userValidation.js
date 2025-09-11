const Joi = require('joi');

const emailValidation = Joi.string().email().required().messages({
    "string.empty": "L'email est requis",
    "string.email": "L'email n'est pas valide"
});

const passwordValidation = Joi.string().min(6).required().messages({
    "string.empty": "Le mot de passe est requis",
    "string.min": "Le mot de passe doit contenir au moins 6 caractères"
});

const confirmPasswordValidation = (ref = "password") =>
  Joi.string().valid(Joi.ref(ref)).required().messages({
    "any.only": "Les mots de passe ne correspondent pas",
    "string.empty": "La confirmation du mot de passe est requise",
  });

const registrationValidation = Joi.object({
    email: emailValidation,
    password: passwordValidation,
    confirmPassword: confirmPasswordValidation("password"),
})

const sessionValidation = Joi.object({
    email: emailValidation,
    password: passwordValidation,
})

const updateEmailValidation = Joi.object({
    newEmail: emailValidation,
    currentPassword: passwordValidation,
})

const updatePasswordValidation = Joi.object({
    currentPassword: passwordValidation,
    newPassword: passwordValidation,
    confirmNewPassword: confirmPasswordValidation("newPassword"),
})

const forgotPasswordValidation = Joi.object({
    email: emailValidation,
})

const resetPasswordValidation = Joi.object({
    newPassword: passwordValidation,
    confirmNewPassword: confirmPasswordValidation("newPassword"),
})

module.exports = { registrationValidation, sessionValidation, updateEmailValidation, updatePasswordValidation, forgotPasswordValidation, resetPasswordValidation };