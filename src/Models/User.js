require('dotenv').config();

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email.');
            }
        }
    },
    phone:{
        type:String,
        require:true,
        unique:true,
    },
    img:{
        type:String,

    },
    photo:{
        type:String,
    },
    date:{
        type:Date,
        default:Date.now()
    },
    password:{
        type:String,
        require:true
    },
    token:{
        type:String,
        require:true,
    }

});

userSchema.pre('save', async function(next){
    this.password = await bcrypt.hash(this.password,parseInt(process.env.BCRYPT_LOOP));
    next();
});

userSchema.methods.createToken = async function(){
    try{
        this.token = jwt.sign({_id:this.id},process.env.JWT_SEC,{expiresIn:process.env.JWT_EXP});
    }catch(error){
        console.log(error)
    }
};


const User = new mongoose.model('User',userSchema);

module.exports = User;

