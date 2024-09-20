const categories = require('../models/categories');
const Categories = require('../models/categories')

exports.createCategories = (req, res) => {
    console.log(req.body)
    if(!req.auth || req.auth.role !== 'admin') {
        return res.status(403).json({ message: 'Requête non autorisée' });
    }
    const categories = new Categories({
        name: req.body.name,
    });
    console.log(categories)
    categories.save()
    .then(categories => { res.status(200).json({ categories})})
    .catch(error => { res.status(400).json( { error })})
};

exports.getAllCategories = (req, res) => {
    if(!req.auth || req.auth.role !== 'admin') {
        return res.status(403).json({ message: 'Requête non autorisée' });
    }
    Categories.find()
        .then(categories => res.status(200).json(categories))
        .catch(error => res.status(400).json({ error }));
}