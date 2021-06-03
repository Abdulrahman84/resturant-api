const validationResult = require('express-validator').validationResult;
const fs = require('fs');
let uploadsPath =  __dirname.replace("middelwares", "uploads") + '\\' ;

const isValid = (req, res, next) => {
    if (validationResult(req).array().length > 0) {
        if (req.file) {
            fs.unlinkSync(uploadsPath + req.file.filename)
        } 
        return res.status(400).json({message: validationResult(req).array()[0]})
    }
    next()
}

module.exports = isValid;