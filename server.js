const express = require("express");
const connectDB = require("./config/database");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/auth"); // 👈 Add this
const passport = require("passport");
const session = require("express-session");
require("dotenv").config();
require("./config/passport"); // 👈 Load passport config

const app = express();

connectDB(); // Connect to MongoDB
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); 

// 🧠 Add these for session + passport
app.use(session({
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

// Routes
app.use("/api/data/orders", orderRoutes);
app.use("/api/data", require("./routes/index"));
app.use("/api/data/auth", authRoutes); // 👈 Mount auth routes



// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));