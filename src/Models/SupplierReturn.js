const mongoose = require('mongoose');

const returnSchema = mongoose.Schema({
    quantity:{
        type:Number,
        require:true
    },
    previousStock:Number,
    product:{
        type:mongoose.Types.ObjectId,
        ref: "Product"
    },
    supplier:{
        type:mongoose.Types.ObjectId,
        ref: "Supplier"
    },
    purchase:{
        type:mongoose.Types.ObjectId,
        ref: "Purchase"
    },
    date:{
        type:Date,
        default:Date.now()
    }
});


const SupplierReturn = mongoose.model('SupplierReturn', returnSchema);

module.exports = SupplierReturn;