const contact = require("../Models/contactModel");
const user = require("../Models/User-Model");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// ✅ Home Route
const home = (req, res) => {
    res.send('Hello, World!');
};

// ✅ Contact Us Controller
const contactUs = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(422).json({ error: "Please fill the contact form" });
        }
        await contact.create({ name, email, message });
        return res.status(201).json({ msg: "Message Sent Successfully" });
    } catch (error) {
        console.error("Contact form error:", error);
        res.status(500).json({ msg: "Error processing contact form", error: error.message });
    }
};

// ✅ Register User Controller
const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        const userExist = await user.findOne({ email });
        if (userExist) {
            return res.status(422).json({ error: "Email already exists" });
        }
        if (password !== confirmPassword) {
            return res.status(422).json({ error: "Password does not match" });
        }
        const salt = 10;
        const hashedPass = await bcrypt.hash(password, salt);
        const newUser = await user.create({ name, email, password: hashedPass, confirmPassword: hashedPass });
        res.status(201).json({ msg: "User registered successfully"});
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ msg: "Server error during registration", error: error.message });
    }
};

// ✅ Login User Controller
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExist = await user.findOne({ email });
        if (!userExist) {
            return res.status(422).json({ message: "Create Account First" });
        }
        const validPass = await bcrypt.compare(password, userExist.password);
        if (validPass) {
            return res.status(201).json({ message: "Login Successful", token: await userExist.genToken(), userId: userExist._id });
        } else {
            res.status(400).json({ message: "Invalid Credentials" });
        }
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
};

// Registration and login controllers removed; handled by Firebase Auth in frontend

// ✅ Authenticated User Data (now from Firebase)
const authUser = async (req, res) => {
    try {
        const userData = req.firebaseUser; // From Firebase middleware
        res.status(200).json({ userData });
        console.log('Firebase user data:', userData);
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    home,
    contactUs,
    register,
    login,
    authUser,
};
