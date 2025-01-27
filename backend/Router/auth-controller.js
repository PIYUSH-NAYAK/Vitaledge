const contact = require("../Models/contactModel");


const home = (req, res) => {
    res.send('Hello, World!');
};

const contactUs =async (req,res)=>{

    try {
        const {name,email,message} = req.body;

    if(!name || !email || !message){
        return res.status(422).json({error: "Please fill the contact form"});
    }
    await contact.create({name,email,message});
    return res.status(201).json({ msg: "Message Sent Successfully" });
        
    } catch (error) {
        console.error("Contact form error:", error);
        res.status(500).json({
            msg: "Error processing contact form",
            error: error.message,
        });
        
    }
    
    
  
}
// const Contact
module.exports = {home,contactUs};
