const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllArticles = async (req, res) => {
    try {
        const articles = await prisma.article.findMany({ include: { user: true } });
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getArticleById = async (req, res) => {
    const { id } = req.params;
    try {
        const article = await prisma.article.findUnique({
            where: { id: parseInt(id) },
            include: {
                user: {
                    select: { id: true, name: true, email: true }
                },
                categories: true
            }
        });
        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }
        res.json(article);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createArticle = async (req, res) => {
    const { title, description, content, imageIds } = req.body;
    try {
        const article = await prisma.article.create({
            data: {
                title,
                description,
                content,
                imageIds,
                userId: req.userId
            }
        });
        res.status(201).json(article);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateArticle = async (req, res) => {
    const { id } = req.params;
    try {
        const article = await prisma.article.findUnique({ where: { id: parseInt(id) } });
        if (!article || article.userId !== req.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const updatedArticle = await prisma.article.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.json(updatedArticle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteArticle = async (req, res) => {
    const { id } = req.params;
    try {
        const article = await prisma.article.findUnique({ where: { id: parseInt(id) } });
        if (!article || article.userId !== req.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        await prisma.article.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Article deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getAllArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle
};