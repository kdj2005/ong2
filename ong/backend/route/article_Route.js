const{Router}=require("express")
const{createArticle,deleteArticle,getArticleById,updateArticle,getArticles}=require('../controllers/articles')

const articleRouter=Router()

// Aligner avec le frontend: GET /api/articles?limit=&sort=
articleRouter.get('/', getArticles);
articleRouter.get('/:id', getArticleById);
articleRouter.post('/', createArticle);
articleRouter.put('/:id', updateArticle);
articleRouter.delete('/:id', deleteArticle);

module.exports = articleRouter;