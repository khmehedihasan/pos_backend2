const Product = require('../Models/Product');
const SubCategory = require('../Models/SubCategory');
const fs = require('fs')


//-------------------------------------------------------add Product------------------------------------------------

exports.addProduct = async (req,res,next)=>{
    try{

        if(req.file == undefined){

            const data = await Product({
                name:req.body.name,
                description:req.body.description,
                purchasePrice:req.body.purchasePrice,
                salePrice:req.body.salePrice,
                subCategory: req.body.subCategoryId
            });
        

    
            const d = await data.save();
    
            if(d != {}){
                const dc = await SubCategory.findByIdAndUpdate(req.body.subCategoryId,{$push:{products:d._id}});
                const dcc = await Product.findById(d._id).populate('subCategory','name description img');
                res.send({status:true,message:"Product added successfully.",data:dcc});
            }else{
                res.send({status:true,message:"Faild to added product."});
            }

        }else{
            const photo = req.file.filename;
            const image = process.env.PUBLIC_LINK+req.file.filename;
            const data = await Product({
                name:req.body.name,
                description:req.body.description,
                purchasePrice:req.body.purchasePrice,
                salePrice:req.body.salePrice,
                subCategory: req.body.subCategoryId,
                img:image,
                photo:photo
                
            });
    
            const d = await data.save();
    
            if(d != {}){
                const dc = await SubCategory.findByIdAndUpdate(req.body.subCategoryId,{$push:{products:d._id}});
                const dcc = await Product.findById(d._id).populate('subCategory','name description img');
                res.send({status:true,message:"Product added successfully.",data:dcc});
            }else{
                res.send({status:true,message:"Faild to added product."});
            }
        }

        
    }catch(error){
        next(error);
    }
}


//---------------------------------------------------all Product--------------------------------------------------------

exports.allProduct = async (req,res,next)=>{
    try{
        const data = await Product.find().select({__v:0}).populate('subCategory purchases sales','name description img supplier payable payed due quantity date product receivable received ');
        if(data.length<1){
            res.status(404).send({status:false,message:"Product not found."});
        }else{
            res.json({status:true,data});
        }
    }catch(error){
        next(error);
    }
}

//-------------------------------------------------------------single Product-------------------------------------------------

exports.singleProduct = async (req,res,next)=>{
    try{
        const data = await Product.findById(req.params.id).select({__v:0}).populate('subCategory purchases sales','name description img supplier payable payed due quantity date product receivable received ');

        if(data == null){
            res.status(404).send({status:false,message:"Product not found."});
        }else{
            res.json({status:true,data});
        }
    }catch(error){
        next(error);
    }
}


//---------------------------------------------------------------------update Product-----------------------------------------------

exports.updateProduct = async (req,res,next)=>{
    try{

        if(req.file == undefined){


            const data = await Product.findByIdAndUpdate(req.params.id,{$set:{
                name:req.body.name,
                description:req.body.description,
                purchasePrice:req.body.purchasePrice,
                salePrice:req.body.salePrice,
                subCategory: req.body.subCategoryId
            }},{new:true}).populate('subCategory','name');


            if(data == null){
    
                res.status(404).send({status:false,message:"Product not found."});
    
            }else{

                if(req.body.subCategoryId == undefined || req.body.subCategoryId == ''){

                    res.json({status:true,message:'Product update successfully.',data});
                    
                }else{
                    const dc = await SubCategory.findByIdAndUpdate(req.body.subCategoryId,{$addToSet:{products:data._id}});
                    res.json({status:true,message:'Product update successfully.',data});

                    if((req.body.subCategoryId != data.subCategory._id)){

                        const dcc = await SubCategory.findByIdAndUpdate(data.subCategory._id,{$pull:{products:data._id}});

                    }
                }

            }

        }else{
            const photo = req.file.filename;
            const image = process.env.PUBLIC_LINK+req.file.filename;
    
            const data = await Product.findByIdAndUpdate(req.params.id,{$set:{
                name:req.body.name,
                description:req.body.description,
                purchasePrice:req.body.purchasePrice,
                salePrice:req.body.salePrice,
                subCategory: req.body.subCategoryId,
                img:image, 
                photo:photo
            }});
            
            if(data == null){
    
                fs.unlink('./src/upload/' + photo, (error) => {
                    if (error) {
                        next(error);
                    }
                });
                res.status(404).send({status:false,message:"Product not found."});
    
            }else{
                
                if(data.photo){
                    fs.unlink('./src/upload/' + data.photo, (error) => {
                        if (error) {
                            next(error);
                        }
                    });
                }

                const ndata = await Product.findById(req.params.id).populate('subCategory','name description img');;

                if(req.body.subCategoryId == undefined || req.body.subCategoryId == ''){

                    res.json({status:true,message:'Product update successfully.',data:ndata});
                    
                }else{
                    const dc = await SubCategory.findByIdAndUpdate(req.body.subCategoryId,{$addToSet:{products:data._id}});
                    res.json({status:true,message:'Product update successfully.',data:ndata});

                    if((req.body.subCategoryId != data.subCategory._id)){

                        const dcc = await SubCategory.findByIdAndUpdate(data.subCategory._id,{$pull:{products:data._id}});

                    }
                }

            }
        }
    }catch(error){
        next(error);
    }
}


//--------------------------------------------------------------------delete Product---------------------------------------------------

exports.deleteProduct = async (req,res,next)=>{
    try{
        const d = await Product.findById(req.params.id);

        if(d == null){
            res.status(404).send({status:false,message:"Product not found."});
        }else{
            const inStock = d.inStock;
            if(inStock > 0){
                res.status(400).send({status:false,message:`${inStock} product found in stock. So, can not delete this product. Please sale!`});
            }else{

                const data = await Product.findByIdAndDelete(req.params.id);
                if(data == null){
                    await res.status(400).send({status:false,message:"Faild to delete product."});
                }
                else{
                    await SubCategory.findByIdAndUpdate(data.subCategory._id,{$pull:{products:data._id}});
                    if(data.photo){
                        fs.unlink('./src/upload/' + data.photo, (error) => {
                            if (error) {
                                next(error);
                            }
                        });
                    }
                    res.json({status:true,message:'Product delete successfully.'});
                }

            }
        }
    }catch(error){
        next(error);
    }
}