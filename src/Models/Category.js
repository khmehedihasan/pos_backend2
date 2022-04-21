const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
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
    subCategorys:[
        {
            type: mongoose.Types.ObjectId,
            ref:"SubCategory"
        }
    ],
    date:{
        type:Date,
        default:Date.now()
    }

});


const Category = mongoose.model("Category", categorySchema);

module.exports = Category;