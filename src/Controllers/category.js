require('dotenv').config();
const Category = require('../Models/Category');
const fs = require('fs');


//-------------------------------------------------------add Category------------------------------------------------

exports.addCategory = async (req,res,next)=>{
    try{


        const data = await Category({
            name:req.body.name,
            description:req.body.description
        });

        const d = await data.save();

        if(d != {}){
            res.send({status:true,message:"Category added successfully.",data:d});
        }else{
            res.send({status:true,message:"Faild to added Category."});
        }


        
    }catch(error){
        next(error);
    }
}


//---------------------------------------------------all Category--------------------------------------------------------

exports.allCategory = async (req,res,next)=>{
    try{
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skip = (page-1) * limit;
        const result = {};
        result.totalData = await Category.countDocuments();
        result.totalPage = Math.ceil(await Category.countDocuments()/limit);
        result.data = []

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

        result.data = await Category.find().select({__v:0}).populate('subCategorys','name description').limit(limit).skip(skip);

        if(result.totalData<1){
            res.status(400).send({status:false,message:"Category not found."});
        }else{
            res.json({status:true,result});
        }

    }catch(error){
        next(error);
    }
}


//---------------------------------------------------search Category--------------------------------------------------------

exports.searchCategory = async (req,res,next)=>{
    try{


        const dcount = await Category.find({"$or":[
            {name: { $regex: req.query.search, $options: 'i' } },
            {description: { $regex: req.query.search, $options: 'i' } }
        ]}).count();

        if(dcount<1){
            res.status(400).send({status:false,message:"Category not found."});
        }else{
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const skip = (page-1) * limit;
            const result = {};
            result.data = []


            result.data = await Category.find({"$or":[
                {name: { $regex: req.query.search, $options: 'i' } },
                {description: { $regex: req.query.search, $options: 'i' } }
            ]}).select({__v:0}).populate('subCategorys','name description').limit(limit).skip(skip);

            result.totalData = dcount;
            result.totalPage = Math.ceil(dcount/limit);


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


//-------------------------------------------------------------single Category-------------------------------------------------

exports.singleCategory = async (req,res,next)=>{
    try{

        const data = await Category.find({_id:req.params.id}).select({__v:0}).populate('subCategorys','name description img');
        if(data.length<1){
            res.status(400).send({status:false,message:"Category not found."});
        }else{
            res.json({status:true,data});
        }
        
    }catch(error){
        next(error);
    }
}


//---------------------------------------------------------------------update Category-----------------------------------------------

exports.updateCategory = async (req,res,next)=>{
    try{

        const data = await Category.findByIdAndUpdate(req.params.id,{$set:{
            name:req.body.name,
            description:req.body.description
        }},{new:true});

        if(data == null){

            res.status(400).send({status:false,message:"Category not found."});

        }else{

            res.json({status:true,message:'Category update successfully.',data});
        }


    }catch(error){
        next(error);
    }
}


//--------------------------------------------------------------------delete Category---------------------------------------------------

exports.deleteCategory = async (req,res,next)=>{
    try{

        const d = await Category.findById(req.params.id).populate('subCategorys');

        if(d == null){
            res.status(400).send({status:false,message:"Category not found."});
        }else{
            const subCategorys = d.subCategorys.length;
            if(subCategorys > 0){
                res.status(400).send({status:false,message:`${subCategorys} Bramd found under this category. So, can not delete this category.`});
            }else{

                const data = await Category.findByIdAndDelete(req.params.id);
                if(data == null){
                    await res.status(400).send({status:false,message:"Faild to delete Category."});
                }
                else{
                    res.json({status:true,message:'Category delete successfully.'});
                }

            }
        }

    }catch(error){
        next(error);
    }
}