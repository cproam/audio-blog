const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const articleController = require('../controllers/articleController');

router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticleById);
router.post('/', authenticate, articleController.createArticle);
router.put('/:id', authenticate, articleController.updateArticle);
router.delete('/:id', authenticate, articleController.deleteArticle);

module.exports = router;