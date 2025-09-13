const Service = require("../models/services")
const assert = require("../validations/assert")

async function serviceBuilder(req, options = { forUpdate: false }) {
    const imageUrl = req.file ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}` : null;
    const tags = await validateAndFormatTags(req.body.tags || []);
    const data = {
        title: req.body.title,
        content: req.body.content,
        tags,
        categoryId: req.body.categoryId,
        price: req.body.price,
    };
    if (!options.forUpdate) {
        return new Service({ ...data, imageUrl, userId: req.auth.userId });
    }
    return { ...data, ...(imageUrl && { imageUrl }) };
}

async function validateAndFormatTags(tags) {
    const cleaned = tags.map((tag) => tag.trim()).filter(Boolean);
    const uniqueTags = [...new Set(cleaned)];
    assert(uniqueTags.length > 5, "Seulement 5 tags sont autorisés", 400);
    return uniqueTags;
}

module.exports = serviceBuilder;