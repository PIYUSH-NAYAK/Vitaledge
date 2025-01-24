
const express = require('express');
const router = require('./Router/auth-router');


const app = express();


app.get('/', (req, res) => {
    res.send('Welcome to the home page');
});
app.use('/', router);

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
