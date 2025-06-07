const Product = require("../models/productModel");

// GET all products
const getProducts = async (req, res) => {
    //#swagger.tags=['Products']
    try {
        const products = await Product.find().populate("category");
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET a single product by ID
const getProductById = async (req, res) => {
    //#swagger.tags=['Products']
   try {
       const product = await Product.findById(req.params.id);
       if (!product) return res.status(404).json({ message: "Product not found" });
       res.json(product);
   } catch (error) {
       res.status(500).json({ error: error.message });
   }
};

// POST create a new product
const createProduct = async (req, res) => {
    //#swagger.tags=['Products']
   try {
       const newProduct = new Product(req.body);
       await newProduct.save();
       res.status(201).json(newProduct);
   } catch (error) {
       res.status(400).json({ error: error.message });
   }
};

// PUT update an existing product
const updateProduct = async (req, res) => {
    //#swagger.tags=['Products']
   try {
       const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
       if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
       res.json(updatedProduct);
   } catch (error) {
       res.status(500).json({ error: error.message });
   }
};

// DELETE a product
const deleteProduct = async (req, res) => {
    //#swagger.tags=['Products']
   try {
       const deletedProduct = await Product.findByIdAndDelete(req.params.id);
       if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
       res.json({ message: "Product deleted successfully" });
   } catch (error) {
       res.status(500).json({ error: error.message });
   }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
}