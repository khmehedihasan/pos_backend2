const Product = require('../Models/Product');
const SupplierReturn = require('../Models/SupplierReturn');
const Purchase = require('../Models/Purchase');
const Supplier = require('../Models/Supplier');




//------------------------------------------------ all return --------------------------------------

exports.allReturn = async (req, res, next)=>{
    try{
        const data = await SupplierReturn.find().select({__v:0}).populate('product supplier purchase','name email phone address payable payed due purchasePrice salePrice purchaseQuantity saleQuantity inStock');
        // .populate('purchase','payable payed due ');
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
        const data = await SupplierReturn.findById(req.params.id).populate('product supplier purchase','name email phone address payable payed due purchasePrice salePrice purchaseQuantity saleQuantity inStock');
        if(data == null){
            res.status(404).send({status:false,message:"No purchase data found.!"});
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
        const prevData = await Purchase.findById(req.params.id).populate('product supplier','name email phone address payable payed due purchasePrice salePrice purchaseQuantity saleQuantity inStock');

        
        if(prevData == null){
            res.status(404).send({status:false,message:"No purchase data found."});
        }else{

            if(prevData.product.inStock > 0){

                if(prevData.product.inStock < parseInt(req.body.quantity)){

                    res.status(404).send({status:false,message:"Insufficient stock."}); 

                }else{

                    const data = await SupplierReturn({
                        quantity: parseInt(req.body.quantity),
                        previousStock: prevData.product.inStock,
                        supplier: prevData.supplier._id,
                        product: prevData.product._id,
                        purchase: prevData._id
        
                    });

                    const d = await data.save();

                    const dd = await Product.findByIdAndUpdate(prevData.product._id,{$set: {inStock: (prevData.product.inStock - parseInt(req.body.quantity)), purchaseQuantity: (prevData.quantity - parseInt(req.body.quantity)) }});

                    console.log()
                    
                    const dt = await Supplier.findByIdAndUpdate(prevData.supplier._id,{$set:{payable: prevData.supplier.payable - (parseInt(req.body.quantity) * prevData.product.purchasePrice),payed: prevData.supplier.payed - (parseInt(req.body.quantity) * prevData.product.purchasePrice)}});

                    const dtt = await Purchase.findByIdAndUpdate(req.params.id,{$set:{payable: prevData.payable - (parseInt(req.body.quantity) * prevData.product.purchasePrice), payed: prevData.payed - (parseInt(req.body.quantity) * prevData.product.purchasePrice), quantity: (prevData.quantity - parseInt(req.body.quantity)) }});

                    if(dd == null){
                        res.send({status:true, message:"Faild to return product."});
                    }else{

                        const dc = await SupplierReturn.findById(d._id).populate('product supplier purchase','name email phone address payable payed due purchasePrice salePrice purchaseQuantity saleQuantity inStock');

                        res.send({status:true,message:"Product return successfully.",data:dc});
                    }
                    
                }

            }else{
                res.status(404).send({status:false,message:"No product found in stock."});
            }

        }
        
    }catch(error){
        next(error);
    }
}