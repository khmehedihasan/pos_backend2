const SubCategory = require('../Models/SubCategory');
const Category = require('../Models/Category');
const mongoose = require('mongoose')


//-------------------------------------------------------add SubCategory------------------------------------------------

exports.addSubCategory = async (req,res,next)=>{
    try{

        const data = await SubCategory({
            name:req.body.name,
            description:req.body.description,
            category: req.body.categoryId
        });
    
        const d = await data.save();

        if(d != {}){
            const dc = await Category.findByIdAndUpdate(req.body.categoryId,{$push:{subCategorys:d._id}});
            res.send({status:true,message:"Brand added successfully.",data:d});
        }else{
            res.send({status:true,message:"Failed to added Brand."});
        }


    }catch(error){
        next(error);
    }
}


//---------------------------------------------------all SubCategory--------------------------------------------------------

exports.allSubCategory = async (req,res,next)=>{
    try{

        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skip = (page-1) * limit;
        const result = {};
        result.totalData = await SubCategory.countDocuments();
        result.data = []


        if(limit == 0){
            result.totalPage = 1;
        }else{
            result.totalPage = Math.ceil(await SubCategory.countDocuments()/limit);
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

        
        result.data = await SubCategory.find().select({__v:0}).populate('category products','name description img salePrice purchasePrice').limit(limit).skip(skip);

        if(result.totalData<1){
            res.status(404).send({status:false,message:"Brand not found."});
        }else{
            res.json({status:true,result});
        }

    }catch(error){
        next(error);
    }
}


//---------------------------------------------------search Category--------------------------------------------------------

exports.searchSubCategory = async (req,res,next)=>{
    try{


        if(mongoose.isValidObjectId(req.query.search)){
            
            const dcount = await SubCategory.find({category: req.query.search }).count();
            
    
            if(dcount<1){
                res.status(400).send({status:false,message:"Brand not found."});
            }else{
                const page = parseInt(req.query.page);
                const limit = parseInt(req.query.limit);
                const skip = (page-1) * limit;
                const result = {};
                result.data = []
    
    
                result.data = await SubCategory.find({category: req.query.search }).select({__v:0}).populate('category products','name description').limit(limit).skip(skip);
    
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


        }else{

            const dcount = await SubCategory.find({"$or":[
                {name: { $regex: req.query.search, $options: 'i' } },
                {description: { $regex: req.query.search, $options: 'i' } }
            ]}).count();
            
    
            if(dcount<1){
                res.status(400).send({status:false,message:"Brand not found."});
            }else{
                const page = parseInt(req.query.page);
                const limit = parseInt(req.query.limit);
                const skip = (page-1) * limit;
                const result = {};
                result.data = []
    
    
                result.data = await SubCategory.find({"$or":[
                    {name: { $regex: req.query.search, $options: 'i' } },
                    {description: { $regex: req.query.search, $options: 'i' } }
                ]}).select({__v:0}).populate('category products','name description').limit(limit).skip(skip);
    
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
            res.status(404).send({status:false,message:"Brand not found."});
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

        const data = await SubCategory.findByIdAndUpdate(req.params.id,{$set:{
            name:req.body.name,
            description:req.body.description,
            category:req.body.categoryId
        }}).populate('category','name');


        if(data == null){

            res.status(404).send({status:false,message:"Brand not found."});

        }else{

            if(req.body.categoryId == undefined || req.body.categoryId == ''){

                res.json({status:true,message:'Brand update successfully.',data});
                
            }else{
                const dc = await Category.findByIdAndUpdate(req.body.categoryId,{$addToSet:{subCategorys:data._id}});
                res.json({status:true,message:'Brand update successfully.',data});

                if((req.body.categoryId != data.category._id)){

                    const dcc = await Category.findByIdAndUpdate(data.category._id,{$pull:{subCategorys:data._id}});

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
            res.status(404).send({status:false,message:"Brand not found."});
        }else{
            const products = d.products.length;
            if(products > 0){
                res.status(400).send({status:false,message:`${products} product found under this Brand. So, can not delete this Brand.`});
            }else{

                const data = await SubCategory.findByIdAndDelete(req.params.id);
                if(data == null){
                    await res.status(400).send({status:false,message:"Faild to delete Brand."});
                }
                else{
                    await Category.findByIdAndUpdate(data.category._id,{$pull:{subCategorys:data._id}});
                    res.json({status:true,message:'Brand delete successfully.'});
                }

            }
        }
    }catch(error){
        next(error);
    }
}