const Sale = require('../Models/Sale');
const Customer = require('../Models/Customer');
const CustomerDue = require('../Models/CustomerDue');






//--------------------------------------------------------------------- all payed due-----------------------------------------------

exports.allDues = async (req, res, next)=>{
    try{
        const data = await CustomerDue.find().select({__v:0}).populate('product customer sale','name email phone address payable payed due salePrice salePrice saleQuantity saleQuantity inStock');
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
        const data = await CustomerDue.findById(req.params.id).populate('product customer sale','name email phone address payable payed due salePrice salePrice saleQuantity saleQuantity inStock');
        if(data == null){
            res.status(404).send({status:false,message:"No sale data found.!"});
        }else{
            res.json({status:true,data});
        }
    }catch(error){
        next(error);
    }
}


//--------------------------------------------------------------------get due---------------------------------------------------

exports.getDue = async (req,res,next)=>{
    try{
        const prevData = await Sale.findById(req.params.id).populate('product customer','name email phone receivable received due');

        if(prevData == null){
            res.status(404).send({status:false,message:"No sale data found."});
        }else{
            const d = await CustomerDue({
                received: parseInt(req.body.received),
                previousDue: prevData.customer.due,
                product: prevData.product._id,
                customer: prevData.customer._id,
                sale: prevData._id
            });

            const dc = await d.save();

            const data = await Sale.findByIdAndUpdate(req.params.id,{$set:{received: prevData.received + parseInt(req.body.received), due: prevData.due - parseInt(req.body.received)}});
            if(data == null){
                res.send({status:true,message:"Faild to get due."});
            }else{
                const dt = await Customer.findByIdAndUpdate(prevData.customer._id,{$set:{received: prevData.customer.received + parseInt(req.body.received), due: prevData.customer.due - parseInt(req.body.received)}});

                const dd = await CustomerDue.findById(dc._id).populate('sale','receivable received due ');

                res.send({status:true,message:"Due get successfully.",data:dd});
            }
        }
    }catch(error){
        next(error);
    }
}