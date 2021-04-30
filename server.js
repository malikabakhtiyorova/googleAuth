const express = require('express');

const app = express();

const PORT = process.env.PORT || 3080

app.set('view engine', 'ejs')

app.get('/', (req,res) => {
    res.render('index')
})

app.listen(PORT, console.log(PORT))