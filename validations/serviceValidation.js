const Joi = require('joi');

const baseServiceValidation = {
    title: Joi.string().trim().min(3).max(100).messages({
        "string.base": "Le titre doit être une chaîne de caractères",
        "string.empty": "Le titre est requis",
        "string.min": "Le titre doit contenir au moins 3 caractères",
        "string.max": "Le titre doit contenir au maximum 100 caractères",
    }),

    content: Joi.string().trim().min(10).messages({
        "string.base": "Le contenu doit être une chaîne de caractères",
        "string.empty": "Le contenu est requis",
        "string.min": "Le contenu doit contenir au moins 10 caractères",
    }),

    tags: Joi.array().items(Joi.string().trim().min(1).messages({
            "string.base": "Chaque tag doit être une chaîne de caractères",
            "string.empty": "Les tags ne peuvent pas être vides",
        })
        ).max(5).messages({ "array.max": "Seulement 5 tags sont autorisés" }),

    categoryId: Joi.string().length(24).hex().messages({
        "string.base": "La catégorie doit être une chaîne de caractères",
        "string.empty": "La catégorie est requise",
        "string.length": "La catégorie doit être un ObjectId valide",
        "string.hex": "La catégorie doit être un ObjectId hexadécimal",
    }),

    price: Joi.number().min(0).messages({
        "number.base": "Le prix doit être un nombre",
        "number.min": "Le prix doit être supérieur ou égal à 0",
    }),

    imageUrl: Joi.string().uri().messages({
        "string.uri": "L'URL de l'image doit être valide",
    }),
};

const createServiceValidation = Joi.object({
    title: baseServiceValidation.title.required().messages({ "any.required": "Le titre est obligatoire" }),
    content: baseServiceValidation.content.required().messages({ "any.required": "Le contenu est obligatoire" }),
    tags: baseServiceValidation.tags.required(),
    categoryId: baseServiceValidation.categoryId.required().messages({ "any.required": "La catégorie est obligatoire" }),
    price: baseServiceValidation.price.required().messages({ "any.required": "Le prix est obligatoire" }),
    imageUrl: baseServiceValidation.imageUrl.required().messages({ "any.required": "L'image est obligatoire" }),
});

const updateServiceValidation = Joi.object({
    title: baseServiceValidation.title,
    content: baseServiceValidation.content,
    tags: baseServiceValidation.tags,
    categoryId: baseServiceValidation.categoryId,
    price: baseServiceValidation.price,
    imageUrl: baseServiceValidation.imageUrl,
});

module.exports = { createServiceValidation, updateServiceValidation };
