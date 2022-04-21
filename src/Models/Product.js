const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    description:{
        type:String,
    },
    photo:{
        type:String,
    },
    img:{
        type:String,
    },
    purchasePrice:{
        type:Number,
        require:true
    },
    salePrice:{
        type:Number,
        require:true
    },
    purchaseQuantity:{
        type:Number,
        default: 0
    },
    saleQuantity:{
        type:Number,
        default: 0
    },
    inStock:{
        type:Number,
        default: 0
    },
    purchases:[
        {
            type: mongoose.Types.ObjectId,
            ref:"Purchase"
        }
    ],
    sales:[
        {
            type: mongoose.Types.ObjectId,
            ref:"Sale"
        }
    ],
    category:{
            type: mongoose.Types.ObjectId,
            ref:"Category"
    },
    subCategory:{
            type:mongoose.Types.ObjectId,
            ref:"SubCategory"
    },
    date:{
        type:Date,
        default:Date.now()
    }

});


const Product = mongoose.model("Product", productSchema);

module.exports = Product;