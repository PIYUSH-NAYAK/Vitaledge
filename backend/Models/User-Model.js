const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema({

    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    confirmPassword:{
        type: String,
        required: true
    }

});


schema.methods.genToken = async function(){
    try {
        return jwt.sign({
            userId: this._id.toString(),
            email: this.email
    
        }
        ,process.env.SECRET_KEY,
        {
            expiresIn: '30d'
        }
        )
        
    } catch (error) {
        console.log("error in generating token", error);    
            return null;
        
    }
  

}




const user= mongoose.model('USERS', schema);

module.exports = user;