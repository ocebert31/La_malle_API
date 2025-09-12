const favorites = require("../../../models/favorites")
const Service = require("../../../models/services")
const mongoose = require('mongoose');

async function getAllServices(query, userId) {
    const { searchQuery = '', page = 1, limit = 20, type = 'all', categoryId } = query;
    const matchStage = await servicesFilters(searchQuery, type, categoryId, userId)
    const services = await buildAllServicesAggregation(matchStage, page, limit);
    return services;
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

async function buildAllServicesAggregation(matchStage, page, limit) {
    const currentPage = parseInt(page, 10);
    const servicesLimit = parseInt(limit, 10);
    const aggregationServicesSteps = [
        { $match: matchStage },
        { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
        { $lookup: { from: 'categories', localField: 'categoryId', foreignField: '_id', as: 'category' } },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
        {
            $project: {
                title:1, imageUrl:1, content:1, tags:1, 
                price:1, createdAt:1, pseudo:'$user.pseudo',
                categoryId:1, categoryName:'$category.name'
            }
        },
        { $sort: { createdAt: -1 } },
        { $skip: (currentPage - 1) * servicesLimit },
        { $limit: servicesLimit }
    ];
    return Service.aggregate(aggregationServicesSteps);
}

module.exports = getAllServices