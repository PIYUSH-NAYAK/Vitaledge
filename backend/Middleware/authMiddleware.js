const User = require('../Models/User-Model');
const jwt = require('jsonwebtoken');

// Use to access data of logged

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');

    if(!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const newToken = token.replace('Bearer ', '').trim();

    try{
        const data =jwt.verify(newToken, process.env.SECRET_KEY);
        const userData = await User.findOne({ email : data.email }).select('-password -confirmPassword');
        req.user = userData;
        req.token = newToken;
        req.id= data._id;
        next();

    }
    catch(error){
        console.error('Token not found');
        

    }
}

module.exports = authMiddleware;