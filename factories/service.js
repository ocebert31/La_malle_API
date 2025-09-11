const Service = require("../models/services")
const { validateAndFormatTags } = require("../utils/service")

async function serviceBuilder(req) {
    const imageUrl = req.file ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`: null;
    const tags = await validateAndFormatTags(req.body.tags || [])
    const service = new Service({
        title: req.body.title,
        content: req.body.content,
        tags,
        imageUrl,
        userId: req.auth.userId,
        categoryId: req.body.categoryId,
        price: req.body.price,
    });
    return service
}

module.exports = serviceBuilder;