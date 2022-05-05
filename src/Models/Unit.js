const mongoose = require('mongoose');

const unitSchema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    shortName:{
        type:String,
    },
    date:{
        type:Date,
        default:Date.now()
    }

});


const Unit = mongoose.model("Unit", unitSchema);

module.exports = Unit;