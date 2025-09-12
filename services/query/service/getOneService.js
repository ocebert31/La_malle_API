const { assert } = require("../../../utils/errorHandler");
const favorites = require("../../../models/favorites");
const Service = require('../../../models/services');
const mongoose = require('mongoose');

async function getOneService(req) {
    const userId = req.auth?.userId ? new mongoose.Types.ObjectId(req.auth.userId) : null;
    const favorite = req.auth ? await favorites.findOne({ userId: req.auth.userId, serviceId: req.params.id }) : null;
    const matchStage = await serviceFilters(req.params.id)
    const services = await buildServiceAggregation(matchStage, req.params.id, userId)
    assert(!services.length, "Service non trouvé", 404)
    return { ...services[0], favorite };
}

async function serviceFilters(serviceId) {
  return {
    _id: new mongoose.Types.ObjectId(serviceId)
  }
}

async function buildServiceAggregation(matchStage, userId = null) {
    const aggregationServiceSteps = [
        { $match: matchStage },
        { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
        { $lookup: { from: 'votes', localField: '_id', foreignField: 'serviceId', as: 'votes' } },
        { $lookup: { from: 'categories', localField: 'categoryId', foreignField: '_id', as: 'category' } },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
        {
            $addFields: {
                upvotes: {
                    $size: { $filter: { input: '$votes', as: 'vote', cond: { $eq: ['$$vote.voteType', 'upvote'] } } }
                },
                downvotes: {
                    $size: { $filter: { input: '$votes', as: 'vote', cond: { $eq: ['$$vote.voteType', 'downvote'] } } }
                },
                userVotes: userId ? { $let: { vars: { filteredVotes: { $filter: { input: '$votes', as: 'vote', cond: { $eq: ['$$vote.userId', userId] } } } }, in: { $arrayElemAt: ['$$filteredVotes', 0] } } } : null
            }
        },
        {
            $project: {
                title: 1, imageUrl: 1, content: 1, tags: 1,
                price: 1, createdAt: 1, userId: 1, pseudo: '$user.pseudo',
                upvotes: 1, downvotes: 1, userVote: userId ? { voteType: '$userVotes.voteType' } : null,
                categoryId: 1, categoryName: '$category.name'
            }
        }
    ];
    return Service.aggregate(aggregationServiceSteps);
}

module.exports = getOneService;