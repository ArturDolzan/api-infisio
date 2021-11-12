const multer = require('multer')
const path   = require('path')

/** Storage Engine */
const storageEngine = multer.diskStorage({
    
    destination: './public/files',
    filename: function(req, file, fn){
        fn(null,  new Date().getTime().toString()+'-'+file.fieldname+path.extname(file.originalname))
    }
});

//init
const upload =  multer({

    storage: storageEngine,
    limits: { fileSize: 10000000 },
    // fileFilter: function(req, file, callback){
    //     validateFile(file, callback)
    // }
})

var validateFile = function(file, cb ){
    allowedFileTypes = /jpeg|jpg|png|gif/
    const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase())
    const mimeType  = allowedFileTypes.test(file.mimetype)
    
    if(mimeType){
        return cb(null, true)
    }else{
        cb("Tipo inválido. Apenas JPEG, PNG and GIF são permitidos.")
    }
}

module.exports = upload