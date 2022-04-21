const errorHandler = async (error,req,res,next)=>{
    if(res.headersSent){
        next('Header already send.');
    }else{
        if(error.message){
            console.log(error.message);
            res.status(500).json({status:false,message:error.message});
        }else{
            console.log('Internal server error.');
            res.status(500).json({status:false,message:'Internal server error.'});
        }
    }
}

module.exports = errorHandler;