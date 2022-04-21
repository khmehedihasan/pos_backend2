const mongoose = require('mongoose');

const purchaseSchema = mongoose.Schema({
    product:{
        type:mongoose.Types.ObjectId,
        ref:"Product"
    },
    supplier:{
        type:mongoose.Types.ObjectId,
        ref:"Supplier"
    },
    supplierName:{
        type:String,
    },
    supplierEmail:{
        type:String,
    },
    supplierPhone:{
        type:String,
    },
    payable:{
        type:Number,
        require:true
    },
    payed:{
        type:Number,
        require:true
    },
    due:{
        type:Number,
        default: 0
    },
    quantity:{
        type:Number,
        default: 1
    },
    date:{
        type:Date,
        default:Date.now()
    }

});


const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;