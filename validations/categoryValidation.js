const Joi = require('joi');

const baseCategoryValidation = {
    name: Joi.string().trim().min(2).messages({
        "string.base": "Le nom de la catégorie doit être une chaîne de caractères",
        "string.empty": "Le nom de la catégorie est requis",
        "string.min": "Le nom de la catégorie doit contenir au moins 2 caractères",
    }),
};

const createCategoryValidation = Joi.object({
    name: baseCategoryValidation.name.required().messages({ "any.required": "Le nom de la catégorie est obligatoire" }),
});

const updateCategoryValidation = Joi.object({
    name: baseCategoryValidation.name,
});


module.exports = { createCategoryValidation, updateCategoryValidation }