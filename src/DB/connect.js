require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(process.env.DB_LOCAL).then(()=>{

    console.log('Database connect successfully.');

}).catch((error)=>{

    console.log(error);

})