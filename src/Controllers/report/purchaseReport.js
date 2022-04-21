const Purchase = require('../../Models/Purchase');




//--------------------------------------get total Purchase----------------------------------

exports.totalPurchase = async (req,res,next) =>{
  try{
      const data = await Purchase.count({});

      res.send([{total:data}]);

  }catch(error){
      next(error)
  }
}



//--------------------------------------get total payed money----------------------------------

exports.totalPayed = async (req,res,next) =>{
    try{
        const data = await Purchase.aggregate([
            {
              "$group": {
                "_id": null,
                "total": {
                  "$sum": "$payed"
                }
              }
            }
          ]);

        res.send(data)
    }catch(error){
        next(error)
    }
}



//--------------------------------------get total purchase due----------------------------------

exports.totalDue = async (req,res,next) =>{
    try{
        const data = await Purchase.aggregate([
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

//--------------------------------------get total purchase porduct quantity----------------------------------

exports.totalPorduct = async (req,res,next) =>{
    try{
        const data = await Purchase.aggregate([
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