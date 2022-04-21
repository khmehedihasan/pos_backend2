const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
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
    sales:[
        {
            type: mongoose.Types.ObjectId,
            ref:"Sale"
        }
    ],
    receivable:{
        type:Number,
        default: 0
    },
    received:{
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


const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;