const Joi = require('joi');

const buildStringValidation = (base, messages) => base.required().messages(messages);

const buildEmailValidation = () =>
    buildStringValidation(
        Joi.string().email(),
        {
            'string.empty': "L'email est requis",
            'string.email': "L'email n'est pas valide",
            'any.required': "L'email est obligatoire",
        }
    );

const buildPasswordValidation = () =>
    buildStringValidation(
        Joi.string().min(6),
        {
            'string.empty': 'Le mot de passe est requis',
            'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
            'any.required': 'Le mot de passe est obligatoire',
        }
    );

const buildConfirmPasswordValidation = (ref = 'password') =>
    Joi.string().empty('').required().valid(Joi.ref(ref)).messages({
        'string.empty': 'La confirmation du mot de passe est requise',
        'any.required': 'La confirmation du mot de passe est obligatoire',
        'any.only': 'Les mots de passe ne correspondent pas',
    });


const registrationValidation = Joi.object({
    email: buildEmailValidation(),
    password: buildPasswordValidation(),
    confirmPassword: buildConfirmPasswordValidation('password'),
});

const sessionValidation = Joi.object({
    email: buildEmailValidation(),
    password: buildPasswordValidation(),
});

const updateEmailValidation = Joi.object({
    newEmail: buildEmailValidation(),
    currentPassword: buildPasswordValidation(),
});

const updatePasswordValidation = Joi.object({
    currentPassword: buildPasswordValidation(),
    newPassword: buildPasswordValidation(),
    confirmNewPassword: buildConfirmPasswordValidation('newPassword'),
});

const forgotPasswordValidation = Joi.object({
    email: buildEmailValidation(),
});

const resetPasswordValidation = Joi.object({
    newPassword: buildPasswordValidation(),
    confirmNewPassword: buildConfirmPasswordValidation('newPassword'),
});

module.exports = { registrationValidation, sessionValidation, updateEmailValidation, updatePasswordValidation, forgotPasswordValidation, resetPasswordValidation };
