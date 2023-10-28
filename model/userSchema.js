const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true
    },
    phone:{
        type: Number,
        required:true
    },
    work:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required:true
    },
    confpassword:{
        type: String,
        required:true
    },
    date:{
        type: Date,
        default: Date.now
    },
    messages:[
        {
            name:{
                type: String,
                required:true
            },
            phone:{
                type: Number
            },
            email:{
                type: String
            },
            message:{
                type: String,
                required: true
            },
        }
    ],
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
});

// hasing password and confpassword
userSchema.pre('save', async function(next){
    console.log("hi from inside");
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12);
        this.confpassword = await bcrypt.hash(this.confpassword, 12);
    }
    next();
});

// we are generating token
userSchema.methods.generateAuthToken = async function(){
    try {
        let token = jwt.sign({_id: this._id}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token:token });
        await this.save();
        return token;
    } catch (error) {
        console.log(err);
    }
}

userSchema.methods.addMessage = async function(name, phone, email, message){
    try {
        this.messages = this.messages.concat({name, phone, email, message:message});
        await this.save();
        return this.messages;
    } catch (error) {
        console.log(error);
    }
}

const User = mongoose.model('USER', userSchema);

module.exports = User;