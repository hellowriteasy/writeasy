const Category = require('../src/models/categories');
const express = require('express');
const router = express.Router();

// GET all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ categories });
    } catch (err) {
        res.status(500).json({ msg: "Categories not found", error: err });
    }
});

// GET a category by ID
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ msg: "Category not found" });
        }
        res.status(200).json({ category });
    } catch (err) {
        res.status(500).json({ msg: "Error fetching category", error: err });
    }
});

// POST a new category
router.post('/', async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ msg: "Category name is required" });
    }
    const category = new Category({ name });

    try {
        await category.save();
        res.status(201).json({ category });
    } catch (err) {
        res.status(500).json({ msg: "Category upload failed", error: err });
    }
});

// PUT to update a category by ID
router.put('/:id', async (req, res) => {
    const { name } = req.body;

    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ msg: "Category not found" });
        }

        category.name = name || category.name;
        await category.save();
        res.status(200).json({ category });
    } catch (err) {
        res.status(500).json({ msg: "Error updating category", error: err });
    }
});

// DELETE a category by ID
router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ msg: "Category not found" });
        }
        res.status(200).json({ msg: "Category deleted" });
    } catch (err) {
        res.status(500).json({ msg: "Error deleting category", error: err });
    }
});

module.exports = router;
