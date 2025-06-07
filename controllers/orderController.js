const Order = require("../models/order");
const { validationResult } = require("express-validator");

exports.getOrders = async (req, res) => {
    const orders = await Order.find().populate("productId userId");
    res.status(200).json(orders);
};

exports.getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id).populate("productId userId");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
};

exports.createOrder = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { userId, productId, quantity, totalPrice } = req.body;
    const order = new Order({ userId, productId, quantity, totalPrice });
    await order.save();
    res.status(201).json(order);
};

exports.updateOrder = async (req, res) => {
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(id, req.body, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
};

exports.deleteOrder = async (req, res) => {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order deleted" });
};
