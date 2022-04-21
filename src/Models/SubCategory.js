const mongoose = require('mongoose');

const subCategorySchema = mongoose.Schema({
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
    category:{
        type: mongoose.Types.ObjectId,
        ref:"Category"
    },
    products:[
        {
            type:mongoose.Types.ObjectId,
            ref:"Product"
        }
    ],
    date:{
        type:Date,
        default:Date.now()
    }

});


const SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategory;