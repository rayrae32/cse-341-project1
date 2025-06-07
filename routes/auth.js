const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
require("dotenv").config();
const passport = require("passport");


/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Login with Google OAuth
 *     description: Redirects the user to Google OAuth login. After successful authentication, redirects to the frontend with a JWT token.
 *     tags: [User]
 *     responses:
 *       302:
 *         description: Redirect to Google login page
 */

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     description: Handles Google OAuth redirect and returns a JWT token to the frontend via URL.
 *     tags: [User]
 *     responses:
 *       302:
 *         description: Redirects to frontend with JWT token
 */
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Send JWT token or redirect to frontend with token
    const token = jwt.sign({ id: req.user._id, email: req.user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // You can redirect to frontend or send token as JSON
    res.json({message: `${token}`});
  }
);


/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account and returns user details.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request - Missing or invalid fields
 */
router.post("/register", async (req, res) => {
    //#swagger.tags = ['User']
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ msg: "Missing fields" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ msg: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ msg: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login and get a JWT token
 *     description: User logs in and receives a JWT token for authentication.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Unauthorized, invalid credentials
 */
router.post("/login", async (req, res) => {
    //#swagger.tags = ['User']
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout
 *     description: Handles logout
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Logged out successfully
 *     security: []  #
 */
router.get("/logout", (req, res) => {
    req.logout(function(err) {
        if (err) {
            return res.status(500).json({ error: "Logout failed" });
        }
        res.json({ message: "Logout successful" });
    });
});


// Protected - Example of a route that requires authentication
router.get("/profile", authMiddleware, async (req, res) => {
    res.json({ message: "Welcome to your profile!", user: req.user });
});

module.exports = router;
