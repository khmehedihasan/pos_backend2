const allowHeaders = async (req,res,next)=>{
    try{
        // res.header('Access-Control-Allow-Origin', "*");
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
        next();
    }catch(error){
        next(error);
    }
}

module.exports = allowHeaders ;