const express = require('express');
const router = require('./Router/auth-router');
const app = express();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', router);
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
