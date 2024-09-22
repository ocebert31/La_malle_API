const Category = require('../models/categories')

exports.createCategory = (req, res) => {
    verifyIsAdmin(req)
    const categories = new Category({
        name: req.body.name,
    });
    categories.save()
    .then(categories => { res.status(200).json({ categories})})
    .catch(error => { res.status(400).json( { error })})
};

exports.getAllCategories = (req, res) => {
    Category.find()
        .then(categories => res.status(200).json(categories))
        .catch(error => res.status(400).json({ error }));
}

exports.deleteCategory = async (req, res) => {
    try {
        verifyIsAdmin(req)
        const category = await verifyExistingCategory(req, res)
        await category.deleteOne();
        return res.status(200).json({ message: 'Catégorie supprimée avec succès' });
    } catch (error) {
        return res.status(500).json({ message: 'Erreur lors de la suppression de la catégorie', error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body; 
    verifyIsAdmin(req)
    const category = await verifyExistingCategory(req, res)
    category.name = name;
    const updatedCategory = await category.save();
    return res.status(200).json({ message: 'Catégorie mise à jour avec succès', category: updatedCategory });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la mise à jour de la catégorie', error: error.message });
  }
};

function verifyIsAdmin(req) {
    if(!req.auth || req.auth.role !== 'admin') {
        const error = new Error('Requête non autorisée');
        error.status = 403;
        throw error; 
    }
}

async function verifyExistingCategory(req, res) {
    const { id } = req.params; 
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    } else {
        return category;
    }
}