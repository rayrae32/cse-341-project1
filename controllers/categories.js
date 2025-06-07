const Category = require("../models/categoryModel");

const getCategories = async (req, res) => {
    //#swagger.tags=['Category']
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

const getCategoryById = async (req, res) => {
    //#swagger.tags=['Category']
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ error: "Category not found" });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

const createCategory = async (req, res) => {
    //#swagger.tags=['Category']
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Category name is required" });
        }
        const newCategory = new Category({ name, description });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

const updateCategory = async (req, res) => {
    //#swagger.tags=['Category']
    try {
        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCategory) return res.status(404).json({ error: "Category not found" });
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

const deleteCategory = async (req, res) => {
    //#swagger.tags=['Category']
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) return res.status(404).json({ error: "Category not found" });
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
}