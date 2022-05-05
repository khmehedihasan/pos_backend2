const Customer = require('../Models/Customer');
const fs = require('fs');


//-------------------------------------------------------add customer------------------------------------------------

exports.addCustomer = async (req,res,next)=>{
    try{

        if(req.file == undefined){

            const data = await Customer({
                name:req.body.name,
                email:req.body.email,
                phone:req.body.phone,
                address:req.body.address
            });
        

    
            const d = await data.save();
    
            if(d != {}){
                res.send({status:true,message:"Customer added successfully.",data:d});
            }else{
                res.send({status:true,message:"Faild to added customer."});
            }

        }else{
            const photo = req.file.filename;
            const image = process.env.PUBLIC_LINK+req.file.filename;
            const data = await Customer({
                name:req.body.name,
                email:req.body.email,
                phone:req.body.phone,
                address:req.body.address,
                img:image,
                photo:photo,
            });
    
            const d = await data.save();
    
            if(d != {}){
                res.send({status:true,message:"Customer added successfully.",data:d});
            }else{
                res.send({status:true,message:"Faild to added customer."});
            }
        }

    }catch(error){
        if(req.file != undefined){
            const photo = req.file.filename;

            fs.unlink('./src/upload/' + photo, (error) => {
                if (error) {
                    next(error);
                }
            });
    
        }

        if(error.code){
            if(error.keyPattern.phone){
                res.status(400).send({status:false,message:"Phone number already present."});
            }
            else{
                res.status(400).send({status:false,message:"Email already present."});
            }
        }
        else{
            next(error);
        }
    }
}


//---------------------------------------------------all customer--------------------------------------------------------

exports.allCustomer = async (req,res,next)=>{
    try{
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skip = (page-1) * limit;
        const result = {};
        result.totalData = await Customer.countDocuments();
        result.data = []


        if(limit == 0){
            result.totalPage = 1;
        }else{
            result.totalPage = Math.ceil(await Customer.countDocuments()/limit);
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

        result.data = await Customer.find().select({__v:0}).populate('sales','product payable payed due quantity date').limit(limit).skip(skip);;
        
        if(result.totalData<1){
            res.status(404).send({status:false,message:"Customer not found."});
        }else{
            res.json({status:true,result});
        }
    }catch(errro){
        next(error);
    }
}


//---------------------------------------------------search Customer--------------------------------------------------------

exports.searchCustomer = async (req,res,next)=>{
    try{


        const dcount = await Customer.find({"$or":[
            {name: { $regex: req.query.search, $options: 'i' } },
            {email: { $regex: req.query.search, $options: 'i' } },
            {phone: { $regex: req.query.search, $options: 'i' } },
            {address: { $regex: req.query.search, $options: 'i' } },
        ]}).count();

        if(dcount<1){
            res.status(400).send({status:false,message:"Customer not found."});
        }else{
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const skip = (page-1) * limit;
            const result = {};
            result.data = []

            result.data = await Customer.find({"$or":[
                {name: { $regex: req.query.search, $options: 'i' } },
                {email: { $regex: req.query.search, $options: 'i' } },
                {phone: { $regex: req.query.search, $options: 'i' } },
                {address: { $regex: req.query.search, $options: 'i' } },
            ]}).select({__v:0}).populate('sales','product payable payed due quantity date').limit(limit).skip(skip);

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

//-------------------------------------------------------------single customer-------------------------------------------------

exports.singleCustomer = async (req,res,next)=>{
    try{
        const data = await Customer.findById(req.params.id).populate('sales','product receivable received due quantity date');;

        if(data == null){
            res.status(404).send({status:false,message:"Customer not found."});
        }else{
            res.json({status:true,data});
        }
    }catch(error){
        next(error);
    }
}


//---------------------------------------------------------------------update customer-----------------------------------------------

exports.updateCustomer = async (req,res,next)=>{
    try{
        if(req.file == undefined){

            const d = await Customer.findById(req.params.id);

            if(d == null){

                res.status(404).send({status:false,message:"Customer not found."});

            }else{

                if((d.email != req.body.email) && (d.phone != req.body.phone)){

                    const data = await Customer.findByIdAndUpdate(req.params.id,{$set:{
                        name:req.body.name,
                        email:req.body.email,
                        phone:req.body.phone,
                        address:req.body.address
                    }},{new:true});
        
        
                    if(data == null){
            
                        res.status(404).send({status:false,message:"Customer not found."});
            
                    }else{
        
                        res.json({status:true,message:'Customer update successfully.',data});
                    }
                }

                if((d.email == req.body.email) && (d.phone == req.body.phone)){
                    
                    const data = await Customer.findByIdAndUpdate(req.params.id,{$set:{
                        name:req.body.name,
                        address:req.body.address
                    }},{new:true});
        
        
                    if(data == null){
            
                        res.status(404).send({status:false,message:"Customer not found."});
            
                    }else{
        
                        res.json({status:true,message:'Customer update successfully.',data});
                    }
                }else{
                    if(d.email == req.body.email){
    
        
                        const data = await Customer.findByIdAndUpdate(req.params.id,{$set:{
                            name:req.body.name,
                            phone:req.body.phone,
                            address:req.body.address
                        }},{new:true});
            
            
                        if(data == null){
                
                            res.status(404).send({status:false,message:"Customer not found."});
                
                        }else{
            
                            res.json({status:true,message:'Customer update successfully.',data});
                        }
        
                    }
                    else if(d.phone == req.body.phone){
        
        
                        const data = await Customer.findByIdAndUpdate(req.params.id,{$set:{
                            name:req.body.name,
                            email:req.body.email,
                            address:req.body.address
                        }},{new:true});
            
            
                        if(data == null){
                
                            res.status(404).send({status:false,message:"Customer not found."});
                
                        }else{
            
                            res.json({status:true,message:'Customer update successfully.',data});
                        }
                    }
                }
    

            }



        }else{

            const d = await Customer.findById(req.params.id);

            if(d == null){

                const photo = req.file.filename;
                fs.unlink('./src/upload/' + photo, (error) => {
                    if (error) {
                        next(error);
                    }
                });
                res.status(404).send({status:false,message:"Customer not found."});

            }else{

                if((d.email != req.body.email) && (d.phone != req.body.phone)){

                    const photo = req.file.filename;
                    const image = process.env.PUBLIC_LINK+req.file.filename;

                    const data = await Customer.findByIdAndUpdate(req.params.id,{$set:{
                        name:req.body.name,
                        email:req.body.email,
                        phone:req.body.phone,
                        address:req.body.address,
                        img:image,
                        photo:photo
                    }});
        
        
                    if(data == null){
            
                        fs.unlink('./src/upload/' + photo, (error) => {
                            if (error) {
                                next(error);
                            }
                        });
                        res.status(404).send({status:false,message:"Customer not found."});
            
                    }else{
                        
                        if(data.photo){
                            fs.unlink('./src/upload/' + data.photo, (error) => {
                                if (error) {
                                    next(error);
                                }
                            });
                        }

                        const ndata = await Customer.findById(req.params.id);
                        res.json({status:true,message:'Customer update successfully.',data:ndata});
        
                    }
                }

                if((d.email == req.body.email) && (d.phone == req.body.phone)){

                    
                    const photo = req.file.filename;
                    const image = process.env.PUBLIC_LINK+req.file.filename;
            
                    const data = await Customer.findByIdAndUpdate(req.params.id,{$set:{
                        name:req.body.name,
                        address:req.body.address,
                        img:image,
                        photo:photo,
                    }});

            
                    if(data == null){
            
                        fs.unlink('./src/upload/' + photo, (error) => {
                            if (error) {
                                next(error);
                            }
                        });
                        res.status(404).send({status:false,message:"Customer not found."});
            
                    }else{
                        
                        if(data.photo){
                            fs.unlink('./src/upload/' + data.photo, (error) => {
                                if (error) {
                                    next(error);
                                }
                            });
                        }
                        const ndata = await Customer.findById(req.params.id);
                        res.json({status:true,message:'Customer update successfully.',data:ndata});
        
                    }
                }
    
                else if(d.email == req.body.email){
    
    
                    const photo = req.file.filename;
                    const image = process.env.PUBLIC_LINK+req.file.filename;
            
                    const data = await Customer.findByIdAndUpdate(req.params.id,{$set:{
                        name:req.body.name,
                        phone:req.body.phone,
                        address:req.body.address,
                        img:image,
                        photo:photo,
                    }});
            
                    if(data == null){
            
                        fs.unlink('./src/upload/' + photo, (error) => {
                            if (error) {
                                next(error);
                            }
                        });
                        res.status(404).send({status:false,message:"Customer not found."});
            
                    }else{
                        
                        if(data.photo){
                            fs.unlink('./src/upload/' + data.photo, (error) => {
                                if (error) {
                                    next(error);
                                }
                            });
                        }
                        const ndata = await Customer.findById(req.params.id);
                        res.json({status:true,message:'Customer update successfully.',data:ndata});
        
                    }
    
                }
                else if(d.phone == req.body.phone){

    
                    const photo = req.file.filename;
                    const image = process.env.PUBLIC_LINK+req.file.filename;
            
                    const data = await Customer.findByIdAndUpdate(req.params.id,{$set:{
                        name:req.body.name,
                        email:req.body.email,
                        address:req.body.address,
                        img:image,
                        photo:photo,
                    }});
            
                    if(data == null){
            
                        fs.unlink('./src/upload/' + photo, (error) => {
                            if (error) {
                                next(error);
                            }
                        });
                        res.status(404).send({status:false,message:"Customer not found."});
            
                    }else{
                        
                        if(data.photo){
                            fs.unlink('./src/upload/' + data.photo, (error) => {
                                if (error) {
                                    next(error);
                                }
                            });
                        }

                        const ndata = await Customer.findById(req.params.id);
                        res.json({status:true,message:'Customer update successfully.',data:ndata});
        
                    }
                }
            }


        }
    }catch(error){
        if(req.file != undefined){
            const photo = req.file.filename;

            fs.unlink('./src/upload/' + photo, (error) => {
                if (error) {
                    next(error);
                }
            });
    
        }
        console.log(error)
        if(error.code){
            if(error.keyPattern.phone){
                res.status(400).send({status:false,message:"Phone number already present."});
            }
            else{
                res.status(400).send({status:false,message:"Email already present."});
            }
        }
        else{
            next(error);
        }
    }
}


//--------------------------------------------------------------------delete customer---------------------------------------------------

exports.deleteCustomer = async (req,res,next)=>{
    try{
        const d = await Customer.findById(req.params.id);

        if(d == null){
            res.status(404).send({status:false,message:"Customer not found."});
        }else{
            const due = d.due;
            if(due > 0){
                res.status(400).send({status:false,message:`${due} due found in customer account. So, can not delete this customer.Please take the due!`});
            }else{

                const data = await Customer.findByIdAndDelete(req.params.id);
                if(data == null){
                    await res.status(400).send({status:false,message:"Faild to delete customer."});
                }
                else{

                    if(data.photo){
                        fs.unlink('./src/upload/' + data.photo, (error) => {
                            if (error) {
                                next(error);
                            }
                        });
                    }
                    res.json({status:true,message:'Customer delete successfully.'});
                }

            }
        }
    }catch(error){
        next(error);
    }
}