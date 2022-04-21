const mongoose = require('mongoose');

const customerDueSchema = mongoose.Schema({
    received:{
        type:Number,
        require:true,
        default: 0
    },
    previousDue :{
        type:Number,
        default: 0
    },
    product:{
        type: mongoose.Types.ObjectId,
        ref: 'Product'
    },
    customer:{
        type: mongoose.Types.ObjectId,
        ref: 'Customer'
    },
    sale:{
        type: mongoose.Types.ObjectId,
        ref: 'Sale'
    },
    date:{
        type:Date,
        default: Date.now(),
    }
});

const CustomerDue = mongoose.model("CustomerDue", customerDueSchema);

module.exports = CustomerDue;