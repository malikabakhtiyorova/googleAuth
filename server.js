const express = require('express');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');

const app = express();
app.use(express.json());
app.use(cookieParser())

const PORT = process.env.PORT || 5000

app.set('view engine', 'ejs')

app.get('/', (req,res) => {
    res.render('index')
})

app.get('/login', (req,res) => {
    res.render('login')
})

app.post('/login', (req,res) => {
    let token = req.body.token
    console.log(token)
})

app.listen(PORT, console.log(PORT))