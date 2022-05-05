require('dotenv').config();
const Unit = require('../Models/Unit');


//-------------------------------------------------------add Unit------------------------------------------------

exports.addUnit = async (req,res,next)=>{
    try{


        const data = await Unit({
            name:req.body.name,
            shortName:req.body.shortName
        });

        const d = await data.save();

        if(d != {}){
            res.send({status:true,message:"Unit added successfully.",data:d});
        }else{
            res.send({status:true,message:"Faild to added Unit."});
        }


        
    }catch(error){
        next(error);
    }
}


//---------------------------------------------------all Unit--------------------------------------------------------

exports.allUnit = async (req,res,next)=>{
    try{
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skip = (page-1) * limit;
        const result = {};
        result.totalData = await Unit.countDocuments();
        result.data = []


        if(limit == 0){
            result.totalPage = 1;
        }else{
            result.totalPage = Math.ceil(await Unit.countDocuments()/limit);
        }

        result.previous = {
            page: page-1,
            limit
        }
        if(page == result.totalPage){
            result.next = {
                page: 0,
                limit
            }    
        }

        else{
            result.next = {
                page: page+1,
                limit
            }
        }

        result.data = await Unit.find().select({__v:0}).limit(limit).skip(skip);

        if(result.totalData<1){
            res.status(400).send({status:false,message:"Unit not found."});
        }else{
            res.json({status:true,result});
        }

    }catch(error){
        next(error);
    }
}


//---------------------------------------------------search Unit--------------------------------------------------------

exports.searchUnit = async (req,res,next)=>{
    try{


        const dcount = await Unit.find({"$or":[
            {name: { $regex: req.query.search, $options: 'i' } },
            {shortName: { $regex: req.query.search, $options: 'i' } }
        ]}).count();

        if(dcount<1){
            res.status(400).send({status:false,message:"Unit not found."});
        }else{
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const skip = (page-1) * limit;
            const result = {};
            result.data = []


            result.data = await Unit.find({"$or":[
                {name: { $regex: req.query.search, $options: 'i' } },
                {shortName: { $regex: req.query.search, $options: 'i' } }
            ]}).select({__v:0}).limit(limit).skip(skip);

            result.totalData = dcount;

            if(limit == 0){
                result.totalPage = 1;
            }else{
                result.totalPage = Math.ceil(dcount/limit);
            }

            result.previous = {
                page: page-1,
                limit
            }
    
            if(page == result.totalPage){
                result.next = {
                    page: 0,
                    limit
                }    
            }else{
                result.next = {
                    page: page+1,
                    limit
                }
            }

            res.json({status:true,result});
        }

    }catch(error){
        next(error);
    }
}


//-------------------------------------------------------------single Unit-------------------------------------------------

exports.singleUnit = async (req,res,next)=>{
    try{

        const data = await Unit.find({_id:req.params.id}).select({__v:0});
        if(data.length<1){
            res.status(400).send({status:false,message:"Unit not found."});
        }else{
            res.json({status:true,data});
        }
        
    }catch(error){
        next(error);
    }
}


//---------------------------------------------------------------------update Unit-----------------------------------------------

exports.updateUnit = async (req,res,next)=>{
    try{

        const data = await Unit.findByIdAndUpdate(req.params.id,{$set:{
            name:req.body.name,
            shortName:req.body.shortName
        }},{new:true});

        if(data == null){

            res.status(400).send({status:false,message:"Unit not found."});

        }else{

            res.json({status:true,message:'Unit update successfully.',data});
        }


    }catch(error){
        next(error);
    }
}


//--------------------------------------------------------------------delete Unit---------------------------------------------------

exports.deleteUnit = async (req,res,next)=>{
    try{

        const d = await Unit.findById(req.params.id);

        if(d == null){
            res.status(400).send({status:false,message:"Unit not found."});
        }else{

            const data = await Unit.findByIdAndDelete(req.params.id);
            if(data == null){
                await res.status(400).send({status:false,message:"Faild to delete Unit."});
            }
            else{
                res.json({status:true,message:'Unit delete successfully.'});
            }

        }

    }catch(error){
        next(error);
    }
}