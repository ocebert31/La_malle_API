const favorites = require("../models/favorites");
const { assert } = require("../utils/errorHandler")
const fs = require('fs/promises');
const mongoose = require('mongoose');

async function validateAndFormatTags(tags) {
  const cleaned = tags.map((tag) => tag.trim()).filter(Boolean);
  const uniqueTags = [...new Set(cleaned)];
  assert(uniqueTags.length > 5, "Seulement 5 tags sont autorisés", 400);
  return uniqueTags;
}

function isAuthorOfCreationOrAdmin(service, auth) {
  assert(service.userId.toString() !== auth.userId.toString() && auth.role !== 'admin', "Seul l'auteur de cette création ou l'admin ont ce droit d'accès", 401)
}

async function buildServiceUpdateData(tags, req) {
  return {
    title: req.body.title,
    content: req.body.content,
    tags,
    categoryId: req.body.categoryId,
    price: req.body.price
  }
}

async function buildServiceImageUpdate(req, service, updateData) {
  if (req.file) {
    await removeOldServiceImage(service)
    updateData.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  }
  return updateData
}

async function removeOldServiceImage(service) {
  if (service.imageUrl) {
    const oldFile = service.imageUrl.split('/images/')[1];
    await fs.unlink(`images/${oldFile}`).catch(() => {});
  }
}

async function servicesFilters(searchQuery, type, categoryId, userId) {
  let matchStage = {};
  if (type === 'favorites' && userId) {
    const favoriteServices = await favorites.find({ userId }).select('serviceId');
    matchStage._id = { $in: favoriteServices.map(f => f.serviceId) };
  }
  if (searchQuery) {
    matchStage.$or = [
      { title: { $regex: searchQuery, $options: 'i' } },
      { categoryId: { $regex: searchQuery, $options: 'i' } },
      { tags: { $elemMatch: { $regex: searchQuery, $options: 'i' } } }
    ];
  }
  if (categoryId) matchStage.categoryId = new mongoose.Types.ObjectId(categoryId);
  return matchStage;
}

async function serviceFilters(serviceId) {
  return {
    _id: new mongoose.Types.ObjectId(serviceId)
  }
}

module.exports = { validateAndFormatTags, isAuthorOfCreationOrAdmin, buildServiceUpdateData, buildServiceImageUpdate, removeOldServiceImage, servicesFilters, serviceFilters }