const home = (req, res) => {
try {
        res.send('Welcome to the home page');
    
} catch (error) {
    console.log('error', error);    
    
}}

module.exports = home;