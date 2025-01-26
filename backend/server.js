require('dotenv').config();

const express = require('express');
const router = require('./Router/auth-router');
const app = express();

const connectDB =require('./Utils/db');

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', router);
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

connectDB().then(() => {

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
});

