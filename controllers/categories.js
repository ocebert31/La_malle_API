const Category = require('../models/categories')

exports.createCategories = (req, res) => {
    verifyIsAdmin(req)
    const categories = new Category({
        name: req.body.name,
    });
    console.log(categories)
    categories.save()
    .then(categories => { res.status(200).json({ categories})})
    .catch(error => { res.status(400).json( { error })})
};

exports.getAllCategories = (req, res) => {
    verifyIsAdmin(req)
    Category.find()
        .then(categories => res.status(200).json(categories))
        .catch(error => res.status(400).json({ error }));
}

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        verifyIsAdmin(req)
        if (!category) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }
        await category.deleteOne();
        return res.status(200).json({ message: 'Catégorie supprimée avec succès' });
    } catch (error) {
        return res.status(500).json({ message: 'Erreur lors de la suppression de la catégorie', error: error.message });
    }
};

function verifyIsAdmin(req) {
    if(!req.auth || req.auth.role !== 'admin') {
        return res.status(403).json({ message: 'Requête non autorisée' });
    }
}