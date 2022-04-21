
const SupplierDue = require('../Models/SupplierDue');
const Purchase = require('../Models/Purchase');
const Supplier = require('../Models/Supplier');



//--------------------------------------------------------------------- all payed due-----------------------------------------------

exports.allDues = async (req, res, next)=>{
    try{
        const data = await SupplierDue.find().select({__v:0}).populate('product supplier purchase','name email phone address payable payed due salePrice purchasePrice purchaseQuantity saleQuantity inStock');
        if(data.length<1){
            res.status(404).send({status:false,message:"No due is payed yet!"});
        }else{
            res.json({status:true,data});
        }
    }catch(error){
        next(error);
    }
}



//--------------------------------------------------------------------- single payed due-----------------------------------------------

exports.singleDue = async (req, res, next)=>{
    try{
        const data = await SupplierDue.findById(req.params.id).populate('product supplier purchase','name email phone address payable payed due salePrice purchasePrice purchaseQuantity saleQuantity inStock');
        if(data == null){
            res.status(404).send({status:false,message:"No purchase data found.!"});
        }else{
            res.json({status:true,data});
        }
    }catch(error){
        next(error);
    }
}

//---------------------------------------------------------------------pay due-----------------------------------------------

exports.payDue = async (req,res,next)=>{
    try{
        const prevData = await Purchase.findById(req.params.id).populate('product supplier','name email phone address payable payed due salePrice purchasePrice purchaseQuantity saleQuantity inStock');
        
        if(prevData == null){
            res.status(404).send({status:false,message:"No purchase data found."});
        }else{
            const d = await SupplierDue({
                payed: parseInt(req.body.payed),
                previousDue: prevData.supplier.due,
                product: prevData.product._id,
                supplier: prevData.supplier._id,
                purchase: prevData._id
            })

            const dc = await d.save();

            const data = await Purchase.findByIdAndUpdate(req.params.id,{$set:{payed: prevData.payed + parseInt(req.body.payed), due: prevData.due - parseInt(req.body.payed)}});
            if(data == null){
                res.send({status:true,message:"Faild to pay due."});
            }else{
                const dt = await Supplier.findByIdAndUpdate(prevData.supplier._id,{$set:{payed: prevData.supplier.payed + parseInt(req.body.payed), due: prevData.supplier.due - parseInt(req.body.payed)}});
                
                const dd = await SupplierDue.findById(dc._id).populate('purchase','payable payed due ');

                res.send({status:true,message:"Due payed successfully.",data:dd});
            }
        }

    }catch(error){
        next(error);
    }
}