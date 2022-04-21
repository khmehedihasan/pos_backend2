const mongoose = require('mongoose');

const returnSchema = mongoose.Schema({
    quantity:{
        type:Number,
        require:true
    },
    previousSold:Number,
    product:{
        type:mongoose.Types.ObjectId,
        ref: "Product"
    },
    customer:{
        type:mongoose.Types.ObjectId,
        ref: "Customer"
    },
    sale:{
        type:mongoose.Types.ObjectId,
        ref: "Sale"
    },
    date:{
        type:Date,
        default:Date.now()
    }
});


const CustomerReturn = mongoose.model('CustomerReturn', returnSchema);

module.exports = CustomerReturn;