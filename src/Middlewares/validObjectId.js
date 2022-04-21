const mongoose = require('mongoose')

const validObjectId = async (req,res,next)=>{

    if(mongoose.isValidObjectId(req.params.id)){
        next();
    }else{
        res.status(400).send({status:false,message:'Invalid id.'});
    }
    
}

module.exports = validObjectId;