require('dotenv').config();
const Category = require('../Models/Category');
const fs = require('fs');


//-------------------------------------------------------add Category------------------------------------------------

exports.addCategory = async (req,res,next)=>{
    try{

        if(req.file == undefined){

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

        }else{
            const photo = req.file.filename;
            const image = process.env.PUBLIC_LINK+req.file.filename;
            const data = await Category({
                name:req.body.name,
                description:req.body.description,
                img:image,
                photo:photo
            });
    
            const d = await data.save();
    
            if(d != {}){
                res.send({status:true,message:"Category added successfully.",data:d});
            }else{
                res.send({status:true,message:"Faild to added Category."});
            }
        }


        
    }catch(error){
        next(error);
    }
}


//---------------------------------------------------all Category--------------------------------------------------------

exports.allCategory = async (req,res,next)=>{
    try{

        const data = await Category.find().select({__v:0}).populate('subCategorys','name description img');
        if(data.length<1){
            res.status(400).send({status:false,message:"Category not found."});
        }else{
            res.json({status:true,data});
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
        if(req.file == undefined){

            const data = await Category.findByIdAndUpdate(req.params.id,{$set:{
                name:req.body.name,
                description:req.body.description
            }},{new:true});

            if(data == null){
    
                res.status(400).send({status:false,message:"Category not found."});
    
            }else{
    
                res.json({status:true,message:'Category update successfully.',data});
            }

        }else{
            const photo = req.file.filename;
            const image = process.env.PUBLIC_LINK+req.file.filename;
    
            const data = await Category.findByIdAndUpdate(req.params.id,{$set:{
                name:req.body.name,
                description:req.body.description,
                img:image, 
                photo:photo
            }});
    
            if(data == null){
    
                fs.unlink('./src/upload/' + photo, (error) => {
                    if (error) {
                        next(error);
                    }
                });
                res.status(400).send({status:false,message:"Category not found."});
    
            }else{
                if(data.photo){
                    fs.unlink('./src/upload/' + data.photo, (error) => {
                        if (error) {
                            next(error);
                        }
                    });
                }
                const ndata = await Category.findById(req.params.id);

                res.json({status:true,message:'Category update successfully.',data:ndata});
            }
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
                res.status(400).send({status:false,message:`${subCategorys} subcategory found under this category. So, can not delete this category.`});
            }else{

                const data = await Category.findByIdAndDelete(req.params.id);
                if(data == null){
                    await res.status(400).send({status:false,message:"Faild to delete Category."});
                }
                else{
                    if(data.photo){
                        fs.unlink('./src/upload/' + data.photo, (error) => {
                            if (error) {
                                next(error);
                            }
                        });
                    }
                    res.json({status:true,message:'Category delete successfully.'});
                }

            }
        }

    }catch(error){
        next(error);
    }
}