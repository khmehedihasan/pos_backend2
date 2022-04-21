const Sale = require('../Models/Sale');
const Product = require('../Models/Product');
const Customer = require('../Models/Customer');




//-------------------------------------------------------add Sale------------------------------------------------

exports.addSale = async (req,res,next)=>{
    try{
        const dtt = await Customer.findById(req.body.customerId);
        const dt = await Product.findById(req.body.productId);


        const data = await Sale({
            product:req.body.productId,
            customer:req.body.customerId,
            receivable: dt.salePrice * parseInt(req.body.quantity),
            received: parseInt(req.body.received),
            due: (dt.salePrice * parseInt(req.body.quantity)) - parseInt(req.body.received),
            quantity:parseInt(req.body.quantity),
            customerName:dtt.name,
            customerEmail:dtt.email,
            customerPhone:dtt.phone,

        });
    

        const d = await data.save();

        if(d != {}){

            if(dt != null){

                const saleQuantity = parseInt(req.body.quantity) + dt.saleQuantity;
                const inStock = dt.inStock - parseInt(req.body.quantity);

                const dc = await Product.findByIdAndUpdate(req.body.productId,{$set:{saleQuantity,inStock},$push:{sales:d._id}});
            }
            

            if(dtt != null){

                const receivable = d.receivable + dtt.receivable;
                const received = parseInt(req.body.received) + dtt.received;
                const due = d.due + dtt.due;

                const dc = await Customer.findByIdAndUpdate(req.body.customerId,{$set:{receivable,received,due},$push:{sales:d._id}});
            }
            const dcc = await Sale.findById(d._id).populate('product customer','name email phone address due img salePrice purchasePrice purchaseQuantity saleQuantity inStock');
            res.send({status:true,message:"Product sale successfully.",data:dcc});
        }else{
            res.send({status:true,message:"Product failed to sale."});
        }
    }catch(error){
        next(error);
    }
}


//---------------------------------------------------all Sale--------------------------------------------------------

exports.allSale = async (req,res,next)=>{
    try{
        const data = await Sale.find().select({__v:0}).populate('product customer','name email phone address due img salePrice purchasePrice purchaseQuantity saleQuantity inStock');
        if(data.length<1){
            res.status(404).send({status:false,message:"No Product is sale yet!"});
        }else{
            res.json({status:true,data});
        }
    }catch(error){
        next(error);
    }
}

//-------------------------------------------------------------single Sale-------------------------------------------------

exports.singleSale = async (req,res,next)=>{
    try{
        const data = await Sale.findById(req.params.id).select({__v:0}).populate('product customer','name email phone address due img salePrice purchasePrice purchaseQuantity saleQuantity inStock');

        if(data == null){
            res.status(404).send({status:false,message:"No sale data found."});
        }else{
            res.json({status:true,data});
        }
    }catch(error){
        next(error);
    }
}


//---------------------------------------------------------------------update Sale-----------------------------------------------

exports.updateSale = async (req,res,next)=>{
    try{
        res.send("ok");
    }catch(error){
        next(error);
    }
}


//--------------------------------------------------------------------delete Sale---------------------------------------------------

exports.deleteSale = async (req,res,next)=>{
    try{
        res.send("ok");
    }catch(error){
        next(error);
    }
}
