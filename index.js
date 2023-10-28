const dotenv = require("dotenv");
const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();

dotenv.config({path:'./config.env'});

require('./db/connection');
const User = require('./model/userSchema');
app.use(cookieParser());

app.use(express.json())

app.use(require('./router/auth'));

const PORT = process.env.PORT || 5000;

// app.get('/about',(req,res)=>{
//     res.send("This is About Page")
// });

// app.get('/contact',(req,res)=>{
//     res.cookie("test", 'shakti');
//     res.send("This is Contact Page")
// });

app.get('/signin',(req,res)=>{
    res.send("This is LogIn Page")
});

app.get('/signup',(req,res)=>{
    res.send("This is Registration Page")
});

app.listen(PORT, ()=>{
    console.log(`server is running at port no ${PORT}`)
});