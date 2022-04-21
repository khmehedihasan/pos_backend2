const mongoose = require('mongoose');

const supplierDueSchema = mongoose.Schema({
    payed:{
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
    supplier:{
        type: mongoose.Types.ObjectId,
        ref: 'Supplier'
    },
    purchase:{
        type: mongoose.Types.ObjectId,
        ref: 'Purchase'
    },
    date:{
        type:Date,
        default: Date.now(),
    }
});

const SupplierDue = mongoose.model("SuppliseDue", supplierDueSchema);

module.exports = SupplierDue;