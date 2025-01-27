require('dotenv').config();
const cors=require('cors');


const express = require('express');
const router = require('./Router/auth-router');
const app = express();
app.use(cors());
var corsOptions = {
    origin: 'http://localhost:5173/',
    methods : "GET,HEAD,PUT,PATCH,POST,DELETE",
    Credentials : true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

const connectDB =require('./Utils/db');

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', router);
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

connectDB().then(() => {

app.listen(7777, () => {
    console.log('Server is running on port 7777');
});
});

