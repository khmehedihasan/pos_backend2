require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User')

// -----------------------------------------------------add user-----------------------------------------------------------------------

exports.addUser = async (req,res,next)=>{
    try{
        console.log(req.body)
        const user = await User({
            name:req.body.name,
            email:req.body.email,
            phone:req.body.phone,
            password:req.body.password
        });

        await user.createToken();
        const data = await user.save();

        res.send(data);

        console.log(data);




    }catch(error){
        if(error.code){
            if(error.keyPattern.phone){
                res.status(400).send({status:false,message:"Phone number already present.",login:false});
            }
            else{
                res.status(400).send({status:false,message:"Email already present.",login:false});
            }
        }
        else{
            next(error);
        }
    }
}


// ------------------------------------------------get all user---------------------------------------


exports.getAlluser = async (req,res,next) =>{
    try{

        const data = await User.find().select({__v:0,password:0,token:0});


        if(data.length > 0){

            res.json(data);

        }else{

            res.status(400).send({status:false,message:'User not found.'});
            
        }

    }catch(error){
        next(error)
    }
}



//--------------------------------------------loin User----------------------------------------------------------


exports.loginUser = async (req,res,next)=>{
    
    try{

        const user = await User.find({email:req.body.email});
       

        if(user.length > 0){

            const isUser = await bcrypt.compare(req.body.password, user[0].password);
            if(isUser){

                const token = await jwt.sign({_id:user[0].id},process.env.JWT_SEC,{expiresIn:process.env.JWT_EXP});
                const data = await User.findByIdAndUpdate(user[0]._id,{token:token},{new:true});

                res.cookie('token',data.token,{expires: new Date(Date.now() + parseInt(process.env.COOKIEEXP)),httpOnly:true, secure:true, signed:true, secret:process.env.COOKIESEC,sameSite:"none" });

                // res.cookie('auth','kfjk5kjksdwk23klskj90fj234i209sfj9u4iwej',{expires: new Date(Date.now() + parseInt(process.env.COOKIEEXP)) });

                res.json({status:true,message:'Login successfully.',login:true});

            }else{
                res.status(401).send({status:false,message:'Authentication failed.',login:false})
            }

        }else{
            res.status(401).send({status:false,message:'Authentication failed.',login:false})
        }

    }catch(error){
        next(error);
    }
}

//--------------------------------------------logout User----------------------------------------------------------


exports.logoutUser = async (req,res,next)=>{
    
    try{

        // const data = await User.findByIdAndUpdate(req.params.id,{$set:{token:''}},{new:true});

        res.clearCookie('token');
        res.clearCookie('auth');
        res.send({status:true,message:'Logout successfully.',login:false});

    }catch(error){
        next(error);
    }
}