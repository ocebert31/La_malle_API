const Service = require('../models/services')
const fs = require('fs');
const mongoose = require('mongoose');
const Favorite = require('../models/favorites'); 

exports.createService = async (req, res) => {
    if(!req.auth || req.auth.role === 'reader') {
        return res.status(403).json({ message: 'Requête non autorisée' });
    }

    const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null;
    const tags = req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [];
    const service = new Service({
        title: req.body.title,
        content: req.body.content,
        tags: tags,
        imageUrl,
        userId: req.auth.userId,
        categoryId: req.body.categoryId,
        price: req.body.price,
    });
    if (tags && tags.length > 5) {
        return res.status(404).json({ message: 'Seulement 5 tags sont autorisés' });
    }
    service.save()
    .then(service => { res.status(200).json({ service })})
    .catch(error => { res.status(400).json( { error })})
};

exports.getAllServices = async (req, res) => {
    const { searchQuery = '', page = 1, limit = 20, type = 'all', categoryId = null } = req.query;
    try {
        const currentPage = parseInt(page, 10);
        const servicesLimit = parseInt(limit, 10);
        let matchStage = {};

        if (type === 'favorites' && req.auth) {
            const favoriteServices = await Favorite.find({ userId: req.auth.userId }).populate('serviceId');
            const favoriteServiceIds = favoriteServices
                .filter(favorite => favorite.serviceId)
                .map(favorite => favorite.serviceId._id);

                matchStage = searchQuery ? { 
                        _id: { $in: favoriteServiceIds },
                        $or: [
                            { title: { $regex: searchQuery, $options: 'i' } },
                            { categoryId: { $regex: searchQuery, $options: 'i' } },
                            { tags: { $elemMatch: { $regex: searchQuery, $options: 'i' } } }
                        ]
                    } : { 
                        _id: { $in: favoriteServiceIds } 
                    };
                } else {
                    matchStage = searchQuery ? { 
                        $or: [
                            { title: { $regex: searchQuery, $options: 'i' } },
                            { categoryId: { $regex: searchQuery, $options: 'i' } },
                            { tags: { $elemMatch: { $regex: searchQuery, $options: 'i' } } }
                        ]
                    } : {};
                }

        if (categoryId) {
            matchStage.categoryId = new mongoose.Types.ObjectId(categoryId);
        }
        const services = await Service.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    title: 1,
                    imageUrl: 1,
                    content: 1,
                    tags: 1,
                    price: 1,
                    createdAt: 1,
                    pseudo: '$user.pseudo',
                    categoryName: '$category.name',
                    categoryId: 1,
                }
            },
            { $sort: { createdAt: -1 } },
            { $skip: (currentPage - 1) * servicesLimit },
            { $limit: servicesLimit },
        ]);
        res.status(200).json(services);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getOneService =  async (req, res) => {
    let favorite = null;
    const userId = req.auth && req.auth.userId ? new mongoose.Types.ObjectId(req.auth.userId): null;
    if(req.auth) {
        favorite = await Favorite.findOne({ userId: req.auth.userId, serviceId: req.params.id });
    }
    Service.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $lookup: {
                from: 'votes',
                localField: '_id',
                foreignField: 'serviceId',
                as: 'votes'
            }
        },
        {
            $lookup: {
                from: 'categories',
                localField: 'categoryId', 
                foreignField: '_id',
                as: 'category'
            }
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
        {
            $addFields: {
                upvotes: {
                    $size: {
                        $filter: {
                            input: '$votes',
                            as: 'vote',
                            cond: { $eq: ['$$vote.voteType', 'upvote'] }
                        }
                    }
                },
                downvotes: {
                    $size: {
                        $filter: {
                            input: '$votes',
                            as: 'vote',
                            cond: { $eq: ['$$vote.voteType', 'downvote'] }
                        }
                    }
                },
                userVotes: userId ? {
                    $let: {
                        vars: {
                            filteredVotes: {
                                $filter: {
                                    input: '$votes',
                                    as: 'vote',
                                    cond: { $eq: ['$$vote.userId', userId] }
                                }
                            }
                        },
                        in: {
                            $arrayElemAt: ['$$filteredVotes', 0]
                        }
                    }
                } : null
            }
        },
        {
            $project: {
                title: 1,
                imageUrl: 1,
                content: 1,
                tags: 1, 
                price: 1,
                createdAt: 1,
                userId: 1,
                pseudo: '$user.pseudo',
                upvotes: 1,
                downvotes: 1,
                userVote: userId ? { voteType: '$userVotes.voteType' } : null,
                categoryId: 1,
                categoryName: '$category.name',
            }
        }
    ]).then(services => {
        if (!services.length) {
            return res.status(404).json({ message: 'Service non trouvé' });
        }
        res.status(200).json({...services[0], favorite});
    })
}

exports.deleteService = (req, res) => {
    const serviceId = req.params.id;

    Service.findOne({ _id: serviceId })
        .then(service => {
            if (!service) {
                return res.status(404).json({ message: 'Service non trouvé' });
            }
            if (!hasAccessToService(service, req.auth)) {
                return res.status(403).json({ message: 'Requête non autorisée' });
            }
            const filename = service.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Service.deleteOne({ _id: serviceId })
                    .then(() => res.status(200).json({ message: 'Service supprimé !' }))
            });
        })
};

exports.updateService = (req, res) => {
    Service.findOne({ _id: req.params.id })
        .then(service => {
            if (!service) {
                return res.status(404).json({ message: 'Service non trouvé' });
            }
            if (!hasAccessToService(service, req.auth)) {
                return res.status(403).json({ message: 'Requête non autorisée' });
            }
            const tags = req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [];
            const update = {
                title: req.body.title,
                content: req.body.content,
                tags: tags,
                categoryId: req.body.categoryId,
                price: req.body.price,
            };
            if (req.file) {
                const oldFilename = service.imageUrl.split('/images/')[1];
                fs.unlink(`images/${oldFilename}`, (err) => {
                    if (err) console.error(err);
                });
                update.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
            }

            Service.findOneAndUpdate(
                { _id: req.params.id },
                { ...update, _id: req.params.id },
                { new: true }
            )
            .then(async (updatedService) => {
                const serviceWithDetails = await Service.aggregate([
                    { $match: { _id: updatedService._id } },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'userId',
                            foreignField: '_id',
                            as: 'user'
                        }
                    },
                    {
                        $lookup: {
                            from: 'categories',
                            localField: 'categoryId',
                            foreignField: '_id',
                            as: 'category'
                        }
                    },
                    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
                    { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
                    {
                        $project: {
                            title: 1,
                            content: 1,
                            tags: 1,
                            price: 1,
                            imageUrl: 1,
                            createdAt: 1,
                            pseudo: '$user.pseudo',
                            categoryName: '$category.name'
                        }
                    }
                ]);

                if (!serviceWithDetails.length) {
                    return res.status(404).json({ message: 'Service mis à jour non trouvé' });
                }

                res.status(200).json({ service: serviceWithDetails[0] });
            })
            .catch((error) => res.status(400).json({ error: error.message }));
        })
        .catch((error) => res.status(500).json({ error: error.message }));
};

function hasAccessToService(service, auth) {
    return service.userId.toString() === auth.userId.toString() || auth.role === 'admin';
}