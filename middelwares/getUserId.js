const jwt = require('jsonwebtoken');

const CheckAndGetUserId = async (req, res, next) => {
    const token = req.headers.authorization;
    try {
        let verify = jwt.verify(token, process.env.JWTSECRET)
        if (verify.role == "user") {
            req.user = verify._id;
        }
        next();
    } catch (error) {
        next()
    }
}
module.exports = CheckAndGetUserId;