require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const cheackToken = async (req,res,next)=>{
    try{

        if(req.signedCookies){
            const token = req.signedCookies.token;
            const data = await User.find({token});
            const varifiedToken = await jwt.verify(token,process.env.JWT_SEC);
            
           
            if(data.length>0 && varifiedToken){
                next();
            }
            else{
                res.status(401).send({status:false,message:'Authentication failed.',login:false});
            }
    
        }
        else{
            res.status(401).send({status:false,message:'Authentication failed.',login:false});
        }
        

    }catch(error){
        res.status(401).send({status:false,message:'Authentication failed.',login:false});
    }

}

module.exports = cheackToken;