const SubCategory = require('../Models/SubCategory');
const Category = require('../Models/Category');
const fs = require('fs');


//-------------------------------------------------------add SubCategory------------------------------------------------

exports.addSubCategory = async (req,res,next)=>{
    try{


        if(req.file == undefined){

            const data = await SubCategory({
                name:req.body.name,
                description:req.body.description,
                category: req.body.categoryId
            });
        

    
            const d = await data.save();
    
            if(d != {}){
                const dc = await Category.findByIdAndUpdate(req.body.categoryId,{$push:{subCategorys:d._id}});
                res.send({status:true,message:"Sub Category added successfully.",data:d});
            }else{
                res.send({status:true,message:"Failed to added Sub Category."});
            }

        }else{
            const photo = req.file.filename;
            const image = process.env.PUBLIC_LINK+req.file.filename;
            const data = await SubCategory({
                name:req.body.name,
                description:req.body.description,
                img:image,
                photo:photo,
                category: req.body.categoryId
            });
    
            const d = await data.save();
    
            if(d != {}){
                const dc = await Category.findByIdAndUpdate(req.body.categoryId,{$push:{subCategorys:d._id}});
                res.send({status:true,message:"Sub Category added successfully.",data:d});
            }else{
                res.send({status:true,message:"Faild to added Sub Category."});
            }
        }

    }catch(error){
        next(error);
    }
}


//---------------------------------------------------all SubCategory--------------------------------------------------------

exports.allSubCategory = async (req,res,next)=>{
    try{
        
        const data = await SubCategory.find().select({__v:0}).populate('category products','name description img salePrice purchasePrice');
        if(data.length<1){
            res.status(404).send({status:false,message:"Sub Category not found."});
        }else{
            res.json({status:true,data});
        }

    }catch(error){
        next(error);
    }
}

//-------------------------------------------------------------single SubCategory-------------------------------------------------

exports.singleSubCategory = async (req,res,next)=>{
    try{
        const data = await SubCategory.findById(req.params.id).select({__v:0}).populate('category products','name description img salePrice purchasePrice');

        if(data == null){
            res.status(404).send({status:false,message:"Sub Category not found."});
        }else{
            res.json({status:true,data});
        }
    }catch(error){
        next(error);
    }
}


//---------------------------------------------------------------------update SubCategory-----------------------------------------------

exports.updateSubCategory = async (req,res,next)=>{
    try{
        if(req.file == undefined){


            const data = await SubCategory.findByIdAndUpdate(req.params.id,{$set:{
                name:req.body.name,
                description:req.body.description,
                category:req.body.categoryId
            }},{new:true}).populate('category','name');


            if(data == null){
    
                res.status(404).send({status:false,message:"Sub Category not found."});
    
            }else{

                if(req.body.categoryId == undefined || req.body.categoryId == ''){

                    res.json({status:true,message:'Sub Category update successfully.',data});
                    
                }else{
                    const dc = await Category.findByIdAndUpdate(req.body.categoryId,{$addToSet:{subCategorys:data._id}});
                    res.json({status:true,message:'Sub Category update successfully.',data});

                    if((req.body.categoryId != data.category._id)){

                        const dcc = await Category.findByIdAndUpdate(data.category._id,{$pull:{subCategorys:data._id}});

                    }
                }

            }

        }else{
            const photo = req.file.filename;
            const image = process.env.PUBLIC_LINK+req.file.filename;
    
            const data = await SubCategory.findByIdAndUpdate(req.params.id,{$set:{
                name:req.body.name,
                description:req.body.description,
                img:image, 
                photo:photo,
                category:req.body.categoryId
            }});
    
            if(data == null){
    
                fs.unlink('./src/upload/' + photo, (error) => {
                    if (error) {
                        next(error);
                    }
                });
                res.status(404).send({status:false,message:"Sub Category not found."});
    
            }else{
                
                if(data.photo){
                    fs.unlink('./src/upload/' + data.photo, (error) => {
                        if (error) {
                            next(error);
                        }
                    });
                }

                const ndata = await SubCategory.findById(req.params.id);

                if(req.body.categoryId == undefined || req.body.categoryId == ''){

                    res.json({status:true,message:'Sub Category update successfully.',data:ndata});
                    
                }else{
                    const dc = await Category.findByIdAndUpdate(req.body.categoryId,{$addToSet:{subCategorys:data._id}});

                    res.json({status:true,message:'Sub Category update successfully.',data:ndata});

                    if((req.body.categoryId != data.category._id)){

                        const dcc = await Category.findByIdAndUpdate(data.category._id,{$pull:{subCategorys:data._id}});

                    }
                }

            }
        }

    }catch(error){
        next(error);
    }
}


//--------------------------------------------------------------------delete SubCategory---------------------------------------------------

exports.deleteSubCategory = async (req,res,next)=>{
    try{
        const d = await SubCategory.findById(req.params.id).populate('products');

        if(d == null){
            res.status(404).send({status:false,message:"Sub Category not found."});
        }else{
            const products = d.products.length;
            if(products > 0){
                res.status(400).send({status:false,message:`${products} product found under this category. So, can not delete this Sub category.`});
            }else{

                const data = await SubCategory.findByIdAndDelete(req.params.id);
                if(data == null){
                    await res.status(400).send({status:false,message:"Faild to delete Sub Category."});
                }
                else{
                    await Category.findByIdAndUpdate(data.category._id,{$pull:{subCategorys:data._id}});
                    if(data.photo){
                        fs.unlink('./src/upload/' + data.photo, (error) => {
                            if (error) {
                                next(error);
                            }
                        });
                    }
                    res.json({status:true,message:'Sub Category delete successfully.'});
                }

            }
        }
    }catch(error){
        next(error);
    }
}