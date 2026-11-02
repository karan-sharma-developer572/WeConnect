const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Included new tool
const User = require('./models/User'); // Included your new blueprint
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to your Cloud MongoDB Atlas Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🚀 Successfully connected to MongoDB Atlas!'))
  .catch((err) => console.error('❌ Database connection error:', err));

// Middleware to automatically read JSON data sent from the frontend
app.use(express.json());

// Serve frontend assets out of the public folder
app.use(express.static(path.join(__dirname, 'public')));


// --- NEW REGISTRATION ENDPOINT ADDED HERE ---
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Basic validation
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill in all fields." });
        }

        // 2. Check if the user already exists in the database
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "An account with this email already exists." });
        }

        // 3. Encrypt (Hash) the password securely so hackers can't read it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create and save the new user to MongoDB Atlas
        const newUser = new User({
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully!" });

    } catch (error) {
        console.error("Registration endpoint error:", error);
        res.status(500).json({ message: "Internal server error. Please try again later." });
    }
});
// Paste this LOGIN endpoint right under your registration route in server.js
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Basic validation
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill in all fields." });
        }

        // 2. Look for the user in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // 3. Compare the typed password with the encrypted password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // 4. Success!
        res.status(200).json({ message: "Login successful! Welcome back." });

    } catch (error) {
        console.error("Login endpoint error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});



// Your previous test route remains safely here
app.get('/api/test', (req, res) => {
    res.json({ message: "Hello from the Node.js backend!" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running smoothly on port ${PORT}`);
});

