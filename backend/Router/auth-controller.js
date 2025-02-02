const contact = require("../Models/contactModel");
const user = require("../Models/User-Model");
const jwt = require('jsonwebtoken');



const home = (req, res) => {
    res.send('Hello, World!');
};



// const Contact
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
        res.status(500).json({
            msg: "Error processing contact form",
            error: error.message,
        });

    }



}


// const Register
const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        // if (!name || !email || !password || !confirmPassword) {
        //     return res.status(422).json({ error: "Please fill the registration form" });
        // }
        const userExist = await user.findOne({ email });

        if (userExist) {
            return res.status(422).json({ error: "Email already exist" });
        }
        if (password !== confirmPassword) {
            return res.status(422).json({ error: "Password does not match" });
        }
        const newUser = await user.create({ name, email, password, confirmPassword });
        res.status(201).json({ 
            msg: "User registered successfully",
            token : await newUser.genToken(),
            userId : newUser._id
        
         });


    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            msg: "Server error during registration",
            error: error.message
        });

    }

};

//const Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userExist = await user.findOne({ email });
        if (!userExist) {
            return res.status(422).json({
                message
                    : "Create Account First"
            });
        }
        if (userExist.password !== password) {
            return res.status(422).json({
                message: "Invalid Credentials"
            });
        }
        else{
            return res.status(201).json({
                message: "Login Successful"
            });
        }

    } catch (error) {
        console.error("Server Error:", error);
      res.status(500).json({ message: "Server error during login" });

    }
}

module.exports = { home, contactUs, register,login };
