const Service = require('../../models/services');

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


module.exports = { buildAllServicesAggregation, buildServiceAggregation };