const Supplier = require('../Models/Supplier');
const fs = require('fs');


//-------------------------------------------------------------add supplier------------------------------------------------


exports.addSupplier = async (req,res,next)=>{
    try{
        
        if(req.file == undefined){

            const data = await Supplier({
                name:req.body.name,
                email:req.body.email,
                phone:req.body.phone,
                address:req.body.address
            });
        

    
            const d = await data.save();
    
            if(d != {}){
                res.send({status:true,message:"Supplier added successfully.", data:d});
            }else{
                res.send({status:true,message:"Faild to added Supplier."});
            }

        }else{
            const photo = req.file.filename;
            const image = process.env.PUBLIC_LINK+req.file.filename;
            const data = await Supplier({
                name:req.body.name,
                email:req.body.email,
                phone:req.body.phone,
                address:req.body.address,
                img:image,
                photo:photo,
            });
    
            const d = await data.save();
    
            if(d != {}){
                res.send({status:true,message:"Supplier added successfully.",data:d});
            }else{
                res.send({status:true,message:"Faild to added Supplier."});
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


//-------------------------------------------------------------get all supplier------------------------------------------------



exports.allSupplier = async (req,res,next)=>{
    try{
        const data = await Supplier.find().select({__v:0}).populate('purchases','product payable payed due quantity date');
        if(data.length<1){
            res.status(404).send({status:false,message:"Supplier not found."});
        }else{
            res.json({status:true,data});
        }
    }catch(error){
        next(error);
    }
}


//-------------------------------------------------------------get single by id supplier------------------------------------------------


exports.singleSupplier = async (req,res,next)=>{
    try{
        const data = await Supplier.findById(req.params.id).select({__v:0}).populate('purchases','product payable payed due quantity date');

        if(data == null){
            res.status(404).send({status:false,message:"Supplier not found."});
        }else{
            res.json({status:true,data});
        }
    }catch(error){
        next(error);
    }
}



//-------------------------------------------------------------update supplier------------------------------------------------


exports.updateSupplier = async (req,res,next) =>{
    try{
        if(req.file == undefined){

            const d = await Supplier.findById(req.params.id);

            if(d == null){

                res.status(404).send({status:false,message:"Supplier not found."});

            }else{

                if((d.email != req.body.email) && (d.phone != req.body.phone)){
                   
                    const data = await Supplier.findByIdAndUpdate(req.params.id,{$set:{
                        name:req.body.name,
                        email:req.body.email,
                        phone:req.body.phone,
                        address:req.body.address
                    }},{new:true});
        
        
                    if(data == null){
            
                        res.status(404).send({status:false,message:"Supplier not found."});
            
                    }else{
        
                        res.json({status:true,message:'Supplier update successfully.',data});
                    }
                }

                if((d.email == req.body.email) && (d.phone == req.body.phone)){
                    
                    const data = await Supplier.findByIdAndUpdate(req.params.id,{$set:{
                        name:req.body.name,
                        address:req.body.address
                    }},{new:true});
        
        
                    if(data == null){
            
                        res.status(404).send({status:false,message:"Supplier not found."});
            
                    }else{
        
                        res.json({status:true,message:'Supplier update successfully.',data});
                    }
                }else{
                    if(d.email == req.body.email){
    
        
                        const data = await Supplier.findByIdAndUpdate(req.params.id,{$set:{
                            name:req.body.name,
                            phone:req.body.phone,
                            address:req.body.address
                        }},{new:true});
            
            
                        if(data == null){
                
                            res.status(404).send({status:false,message:"Supplier not found."});
                
                        }else{
            
                            res.json({status:true,message:'Supplier update successfully.',data});
                        }
        
                    }
                    else if(d.phone == req.body.phone){
        
        
                        const data = await Supplier.findByIdAndUpdate(req.params.id,{$set:{
                            name:req.body.name,
                            email:req.body.email,
                            address:req.body.address
                        }},{new:true});
            
            
                        if(data == null){
                
                            res.status(404).send({status:false,message:"Supplier not found."});
                
                        }else{
            
                            res.json({status:true,message:'Supplier update successfully.',data});
                        }
                    }
                }
    

            }



        }else{

            const d = await Supplier.findById(req.params.id);

            if(d == null){

                const photo = req.file.filename;
                fs.unlink('./src/upload/' + photo, (error) => {
                    if (error) {
                        next(error);
                    }
                });
                res.status(404).send({status:false,message:"Supplier not found."});

            }else{

                if((d.email != req.body.email) && (d.phone != req.body.phone)){

                    const data = await Supplier.findByIdAndUpdate(req.params.id,{$set:{
                        name:req.body.name,
                        email:req.body.email,
                        phone:req.body.phone,
                        address:req.body.address
                    }});
        
        
                    if(data == null){
            
                        fs.unlink('./src/upload/' + photo, (error) => {
                            if (error) {
                                next(error);
                            }
                        });
                        res.status(404).send({status:false,message:"Supplier not found."});
            
                    }else{
                        
                        if(data.photo){
                            fs.unlink('./src/upload/' + data.photo, (error) => {
                                if (error) {
                                    next(error);
                                }
                            });
                        }
        
                        const ndata = await Supplier.findById(req.params.id);
                        res.json({status:true,message:'Supplier update successfully.',data:ndata});
        
                    }
                }

                if((d.email == req.body.email) && (d.phone == req.body.phone)){

                    
                    const photo = req.file.filename;
                    const image = process.env.PUBLIC_LINK+req.file.filename;
            
                    const data = await Supplier.findByIdAndUpdate(req.params.id,{$set:{
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
                        res.status(404).send({status:false,message:"Supplier not found."});
            
                    }else{
                        
                        if(data.photo){
                            fs.unlink('./src/upload/' + data.photo, (error) => {
                                if (error) {
                                    next(error);
                                }
                            });
                        }

                        const ndata = await Supplier.findById(req.params.id);
        
                        res.json({status:true,message:'Supplier update successfully.',data:ndata});
        
                    }
                }
    
                else if(d.email == req.body.email){
    
    
                    const photo = req.file.filename;
                    const image = process.env.PUBLIC_LINK+req.file.filename;
            
                    const data = await Supplier.findByIdAndUpdate(req.params.id,{$set:{
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
                        res.status(404).send({status:false,message:"Supplier not found."});
            
                    }else{
                        
                        if(data.photo){
                            fs.unlink('./src/upload/' + data.photo, (error) => {
                                if (error) {
                                    next(error);
                                }
                            });
                        }

                        const ndata = await Supplier.findById(req.params.id);
        
                        res.json({status:true,message:'Supplier update successfully.',data:ndata});
        
                    }
    
                }
                else if(d.phone == req.body.phone){

    
                    const photo = req.file.filename;
                    const image = process.env.PUBLIC_LINK+req.file.filename;
            
                    const data = await Supplier.findByIdAndUpdate(req.params.id,{$set:{
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
                        res.status(404).send({status:false,message:"Supplier not found."});
            
                    }else{
                        
                        if(data.photo){
                            fs.unlink('./src/upload/' + data.photo, (error) => {
                                if (error) {
                                    next(error);
                                }
                            });
                        }
                        const ndata = await Supplier.findById(req.params.id);
        
                        res.json({status:true,message:'Supplier update successfully.',data:ndata});
        
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


//-------------------------------------------------------------delete supplier------------------------------------------------


exports.deleteSupplier = async (req,res,next)=>{
    try{
        const d = await Supplier.findById(req.params.id);

        if(d == null){
            res.status(404).send({status:false,message:"Supplier not found."});
        }else{
            const due = d.due;
            if(due > 0){
                res.status(400).send({status:false,message:`${due} due found in supplier account. So, can not delete this supplier. Please pay the due!`});
            }else{

                const data = await Supplier.findByIdAndDelete(req.params.id);
                if(data == null){
                    await res.status(400).send({status:false,message:"Faild to delete supplier."});
                }
                else{

                    if(data.photo){
                        fs.unlink('./src/upload/' + data.photo, (error) => {
                            if (error) {
                                next(error);
                            }
                        });
                    }
                    res.json({status:true,message:'Supplier delete successfully.'});
                }

            }
        }
    }catch(error){
        next(error);
    }
}