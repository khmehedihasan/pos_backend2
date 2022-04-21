const mongoose = require('mongoose');

const saleSchema = mongoose.Schema({
    product:{
        type:mongoose.Types.ObjectId,
        ref:"Product"
    },
    customer:{
        type:mongoose.Types.ObjectId,
        ref:"Customer"
    },
    customerName:{
        type:String,
    },
    customerEmail:{
        type:String,
    },
    customerPhone:{
        type:String,
    },
    receivable:{
        type:Number,
        require:true
    },
    received:{
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


const Sale = mongoose.model("Sale", saleSchema);

module.exports = Sale;