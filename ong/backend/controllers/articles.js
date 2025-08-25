// GET /api/articles - Récupérer tous les articles avec options de filtrage
const Article = require('../model/articles');

// Récupérer tous les articles
async function getArticles(req, res) {
   try {
          const { limit, sort } = req.query;
          let query = Article.find({ isPublished: true });
          
          // Trier les articles
          if (sort === 'date') {
              query = query.sort({ date: 1 });
          } else if (sort === '-date') {
              query = query.sort({ date: -1 });
          } else {
              query = query.sort({ date: -1 }); // Par défaut: plus récents d'abord
          }
          
          // Limiter le nombre de résultats
          if (limit) {
              query = query.limit(parseInt(limit));
          }
          
          const articles = await query.exec();
          res.json(articles);
      } catch (error) {
          res.status(500).json({ message: error.message });
      }
  };

async function getArticleById(req, res) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'ID d\'article manquant' });
    }
    try {
        const article = await Article.findOne({ 
            _id: id, 
            isPublished: true 
        });

        if (!article) {
            return res.status(404).json({ message: 'Article non trouvé' });
        }

        res.status(200).json({ message: 'Article récupéré avec succès', data: article });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function createArticle(req, res) {
    try {
        const article = new Article(req.body);
        const newArticle = await article.save();
        res.status(201).json({ message: 'Article créé avec succès', data: newArticle });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// POST /api/articles - Créer un nouvel article
async function updateArticle(req, res) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'ID d\'article manquant' });
    }
    try {
        const article = await Article.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true, runValidators: true }
        );
        
        if (!article) {
            return res.status(404).json({ message: 'Article non trouvé' });
        }
        
        res.json(article);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// DELETE /api/articles/:id - Supprimer un article
async function deleteArticle(req, res) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'ID d\'article manquant' });
    }

    try {
        const article = await Article.findByIdAndDelete(id);

        if (!article) {
            return res.status(404).json({ message: 'Article non trouvé' });
        }
        
        res.json({ message: 'Article supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
};