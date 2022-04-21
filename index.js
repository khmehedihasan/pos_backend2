require('dotenv').config();
require('./src/DB/connect');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();


app.use(express.json({
    type:['application/json','text/plain','application/x-www-form-urlencoded']
}));

app.use(cookieParser(process.env.COOKIESEC));

app.use(require('./src/Middlewares/allowHeaders'));

app.use('/public/upload',express.static('./src/upload'));


app.get('/', async (req,res,next)=>{

   try{
        res.cookie('ton','osjdfojsdfjdsfjsdjfdojsf',{expires: new Date(Date.now() + parseInt(process.env.COOKIEEXP)), httpOnly: true , secure: true, signed:true, secret:process.env.COOKIESEC, sameSite:"none" }) 
        res.send('hello');
        // console.log(req.signedCookies.ton)
   }catch(error){

        next(error);

   }
})


//----------------------------------------------------Routers-----------------------------------------------------

app.use('/user',require('./src/Routers/user'));

app.use('/supplier', require('./src/Routers/supplier'));

app.use('/customer', require('./src/Routers/customer'));

app.use('/category', require('./src/Routers/category'));

app.use('/subCategory', require('./src/Routers/subCategory'));

app.use('/product', require('./src/Routers/product'));

app.use('/purchase', require('./src/Routers/purchase'));

app.use('/sale', require('./src/Routers/sale'));

app.use('/due/supplier', require('./src/Routers/supplierDue'));

app.use('/due/customer', require('./src/Routers/CustomerDue'));

app.use('/return/supplier', require('./src/Routers/SupplierReturn'));

app.use('/return/customer', require('./src/Routers/customerReturn'));

app.use('/report', require('./src/Routers/report'));







//----------------------------------------------Error handler-----------------------------------------------

app.use(require('./src/Middlewares/errorHandler'));




app.listen(process.env.PORT,()=>{
    console.log(`App is running on port ${process.env.PORT}...`);
});