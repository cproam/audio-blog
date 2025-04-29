const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
    const images = await prisma.gallery.findMany();
    res.json(images);
});

router.post('/', async (req, res) => {
    const { url, alt } = req.body;
    try {
        const image = await prisma.gallery.create({
            data: { url, alt }
        });
        res.status(201).json(image);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;