const Sale = require('../../Models/Sale');




//--------------------------------------get total sale----------------------------------

exports.totalSale = async (req,res,next) =>{
  try{
      const data = await Sale.count({});

      res.send([{total:data}]);

  }catch(error){
      next(error)
  }
}



//--------------------------------------get total received money----------------------------------

exports.totalReceived = async (req,res,next) =>{
    try{
        const data = await Sale.aggregate([
            {
              "$group": {
                "_id": null,
                "total": {
                  "$sum": "$received"
                }
              }
            }
          ]);

        res.send(data)
    }catch(error){
        next(error)
    }
}



//--------------------------------------get total sales due----------------------------------

exports.totalDue = async (req,res,next) =>{
    try{
        const data = await Sale.aggregate([
            {
              "$group": {
                "_id": null,
                "total": {
                  "$sum": "$due"
                }
              }
            }
          ]);

        res.send(data)
    }catch(error){
        next(error)
    }
}

//--------------------------------------get total sales porduct quantity----------------------------------

exports.totalPorduct = async (req,res,next) =>{
    try{
        const data = await Sale.aggregate([
            {
              "$group": {
                "_id": null,
                "total": {
                  "$sum": "$quantity"
                }
              }
            }
          ]);

        res.send(data)
    }catch(error){
        next(error)
    }
}