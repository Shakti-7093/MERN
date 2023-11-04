const dotenv = require("dotenv");
const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();

dotenv.config({path:'.env'});

require('./db/connection');
const User = require('./model/userSchema');
app.use(cookieParser());

app.use(express.json())

app.use(require('./router/auth'));

const PORT = process.env.PORT || 5000;

app.get('/about',(req,res)=>{
    res.render("./router/auth.js")
});

app.get('/contact',(req,res)=>{;
    res.render("./router/auth.js")
});

app.get('/signin',(req,res)=>{
    res.render("./router/auth.js")
});

app.get('/signup',(req,res)=>{
    res.render("./router/auth.js")
});

app.listen(PORT, ()=>{
    console.log(`server is running at port no ${PORT}`)
});
