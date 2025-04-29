const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Invalid token' });
        req.userId = decoded.id;
        next();
    });
};

router.get('/', async (req, res) => {
    const articles = await prisma.article.findMany({ include: { user: false } });
    res.json(articles);
});

router.post('/', authenticate, async (req, res) => {
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
});

router.put('/:id', authenticate, async (req, res) => {
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
});

router.delete('/:id', authenticate, async (req, res) => {
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
});

module.exports = router;