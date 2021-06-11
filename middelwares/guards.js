const jwt = require("jsonwebtoken");

exports.isAdmin = (req, res, next) => {
  try {
    var token = req.headers["authorization"];
    const verify = jwt.verify(token, process.env.JWTSECRET, {
      expiresIn: "7d",
    });
    if (verify.role == "admin") next();
    else res.status(400).json({ message: "you aren't admin" });
  } catch (err) {
    res.status(401).json({ message: "invalid signature" });
  }
};
exports.isUser = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) return res.send({ error: "please provide a token" });
    const verify = jwt.verify(token, process.env.JWTSECRET);
    req.email = verify.email;
    req.user = verify._id;
    req.role = verify.role;
    next();
  } catch (err) {
    res.status(400).json({ message: "invalid token" });
  }
};
