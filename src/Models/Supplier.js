const mongoose = require('mongoose');

const supplierSchema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        unique:true
    },
    phone:{
        type:String,
        require:true,
        unique:true
    },
    address:{
        type:String,
        require:true
    },
    photo:{
        type:String,
    },
    img:{
        type:String,
    },
    purchases:[
        {
            type: mongoose.Types.ObjectId,
            ref:"Purchase"
        }
    ],
    payable:{
        type:Number,
        default: 0
    },
    payed:{
        type:Number,
        default: 0
    },
    due:{
        type:Number,
        default: 0
    },
    date:{
        type:Date,
        default:Date.now()
    }
});

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;