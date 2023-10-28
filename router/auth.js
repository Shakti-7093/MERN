const express = require('express');
const User = require('../model/userSchema');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const authenticate = require('../middleware/authenticate')

require('../db/connection');
require('../model/userSchema');
router.use(cookieParser());

router.get('/', (req,res)=>{
    res.send("Hello we are MERN Developers router js");
});

// Promises:

// router.post('/register', (req,res)=>{
//     const { name,email,phone,work,password,confpassword } = req.body;
//     if(!name || !email || !phone || !work || !password || !confpassword){
//         return res.status(422).json({ error: "plz filled the field properly" });
//     }

//     User.findOne({email:email})
//     .then((userExist)=>{
//         if(userExist){
//             return res.status(422).json({ error: "Email already Exist" });
//         }
        
//         const user = new User({ name, email, phone, work, password, confpassword });

//         user.save().then(()=>{
//             res.status(201).json({ message:"user registered successfuly" })
//         }).catch((e)=> res.status(500).json({ error:"Faild to register. Please try agin" }));
//     }).catch(error => {console.log(error)});
// });

// Async:

router.post('/register', async (req,res)=>{
    const { name,email,phone,work,password,confpassword } = req.body;
    if(!name || !email || !phone || !work || !password || !confpassword){
        return res.status(422).json({ error: "plz filled the field properly" });
    }
    try{
        const userExist = await User.findOne({email:email})
        if(userExist){
            return res.status(422).json({ error: "Email already Exist" });
        }else if(password != confpassword){
            return res.status(422).json({ error: "Password are not matching" });
        }else{
            const user = new User({ name, email, phone, work, password, confpassword });
            await user.save();
        
            res.status(201).json({ message:"user registered successfuly" });
        }
    }catch(e){console.log(e)};
});

// login route

router.post('/signin', async (req,res)=>{
    // console.log(req.body);
    // res.json({message:"awsome"});
    try{
        var token;
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({ error:"plaese fill the data" });
        }

        const userLogin = await User.findOne({email:email});

        if(userLogin){
            const isMatch = await bcrypt.compare(password, userLogin.password);
            token = await userLogin.generateAuthToken();
            res.cookie("jwtoken", token,{
                expires: new Date(Date.now()+2592000000),
                httpOnly:true
            });
            if(isMatch){
                res.json({ message:"user signin successfuly" });
            }
            else{
                window.alert("Invalid Filled, User Dosnt Exist");
                res.status(401).json({ message: "Invalid filled" });
            }
        }
        else{
            res.json({ message:"Invalid filled" });
        }
    }catch (e){console.log(e)};
})

router.get('/about', authenticate, (req,res)=>{
    console.log('hello');
    res.send(req.rootUser);
});

router.get('/getdata', authenticate, (req,res)=>{
    console.log('hello from server message');
    res.send(req.rootUser);
});

router.post('/contact', authenticate, async (req,res)=>{
    console.log("posting")
    try {
        const {name, phone, email, message} = req.body;
        if(!name || !phone || !email || !message){
            console.log("error in contact form");
            return res.json({error: "please filled the contact form"});
        }
        const userContact = await User.findOne({ _id:req.userID });
        if(userContact){
            const userMessages = await userContact.addMessage(name, phone, email, message);
            await userContact.save();
            res.status(201).json({message: "User Contact Successfuly"});
        }
    } catch (error) {
        console.log(error);
    }
})

router.get('/logout', (req,res)=>{
    console.log('hello logout page');
    res.clearCookie('jwtoken');
    res.status(200).send('User LogOut');
});

module.exports = router;