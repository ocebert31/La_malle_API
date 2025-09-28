const Joi = require('joi');

const baseCommentValidation = {
    content: Joi.string().trim().min(2).messages({
        "string.empty": "Le contenu du commentaire est requis",
        "string.min": "Le contenu du commentaire doit contenir au moins 2 caractères",
    }),
};

const createCommentValidation = Joi.object({
    content: baseCommentValidation.content.required().messages({ "any.required": "Le contenu du commentaire est obligatoire" }),
});

const updateCommentValidation = Joi.object({
    content: baseCommentValidation.content,
});

module.exports = { createCommentValidation, updateCommentValidation }