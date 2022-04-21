const Product = require('../Models/Product');
const CustomerReturn = require('../Models/CustomerReturn');
const Sale = require('../Models/Sale');
const Customer = require('../Models/Customer');




//------------------------------------------------ all return --------------------------------------

exports.allReturn = async (req, res, next)=>{
    try{
        const data = await CustomerReturn.find().select({__v:0}).populate('product customer sale','name email phone address receivable received due salePrice purchasePrice saleQuantity saleQuantity inStock');
        // .populate('sale','receivable received due ');
        if(data.length<1){
            res.status(404).send({status:false,message:"No product return yet!"});
        }else{
            res.json({status:true,data});
        }
    }catch(error){
        next(error);

    }
}


//------------------------------------------------ single return --------------------------------------

exports.singleReturn = async (req, res, next)=>{
    try{
        const data = await CustomerReturn.findById(req.params.id).populate('product customer sale','name email phone address receivable received due salePrice purchasePrice saleQuantity saleQuantity inStock');
        if(data == null){
            res.status(404).send({status:false,message:"No sale data found.!"});
        }else{
            res.json({status:true,data});
        }

    }catch(error){
        next(error);

    }
}


//------------------------------------------- return product --------------------------------------------

exports.returnProduct = async (req, res, next)=>{
    try{
        const prevData = await Sale.findById(req.params.id).populate('product customer','name email phone address receivable received due salePrice purchasePrice saleQuantity saleQuantity inStock');

        
        if(prevData == null){
            res.status(404).send({status:false,message:"No sale data found."});
        }else{

            if(prevData.quantity < parseInt(req.body.quantity)){

                res.status(404).send({status:false,message:`Only ${prevData.quantity} product sold.`}); 


            }else{
                const data = await CustomerReturn({
                    quantity: parseInt(req.body.quantity),
                    previousSold: prevData.quantity,
                    customer: prevData.customer._id,
                    product: prevData.product._id,
                    sale: prevData._id
    
                });
                
                const d = await data.save();

                const dd = await Product.findByIdAndUpdate(prevData.product._id,{$set: {inStock: (prevData.product.inStock + parseInt(req.body.quantity)), saleQuantity: prevData.quantity - parseInt(req.body.quantity) }});
                
                const dt = await Customer.findByIdAndUpdate(prevData.customer._id,{$set:{receivable: prevData.customer.receivable - (parseInt(req.body.quantity) * prevData.product.salePrice), received: prevData.customer.received - (parseInt(req.body.quantity) * prevData.product.salePrice)}});

                const dtt = await Sale.findByIdAndUpdate(req.params.id,{$set:{receivable: prevData.receivable - (parseInt(req.body.quantity) * prevData.product.salePrice), received: prevData.received - (parseInt(req.body.quantity) * prevData.product.salePrice), quantity:  prevData.quantity - parseInt(req.body.quantity) }});

                if(dd == null){
                    res.send({status:true, message:"Faild to return product."});
                }else{
                    const dc = await CustomerReturn.findById(d._id).populate('product customer sale','name email phone address receivable received due salePrice purchasePrice saleQuantity saleQuantity inStock');
                    res.send({status:true,message:"Product return successfully.",data: dc});
                }
            }

        }
        
    }catch(error){
        next(error);
    }
}