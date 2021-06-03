const jwt = require('jsonwebtoken');

exports.isAdmin =  (req, res, next) => {
    try {
        var token = req.headers['authorization'];
        const verify =  jwt.verify(token, process.env.JWTSECRET, { expiresIn: '7d' });
        if (verify.role == "admin") 
            next();
        else 
            res.status(400).json({message: "you aren't admin"});
    } catch (err) {
        res.status(500).json({message: "something went wrong"});
    }
}
exports.isUser =  (req, res, next) => {
    let token = req.headers.authorization;
    try {
        const verify =  jwt.verify(token, process.env.JWTSECRET);
        req.email = verify.email;
        req.user = verify._id;
        req.role = verify.role;
        next();
    } catch (err) {
        res.status(400).json({message: "you should sign in first"});
    }
}
