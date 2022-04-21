const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './src/upload/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null,uniqueSuffix+ '-' + file.originalname )
    }
  });


const fileFilter = (req,file,cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null,true);
    }
    else{
        cb(null,false);
        cb(new Error('File must be in .jpg .jpeg or .png format'))
        
    }
  }

  
const uploadPhoto = multer({ storage: storage, fileFilter:fileFilter, limits: {fileSize: 1*1000000}});

module.exports = uploadPhoto;