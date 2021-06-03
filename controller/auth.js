const User = require('../model/user');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
exports.signin = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({email})
    if (!user) { 
        return res.status(400).json({message: "This email isn't used"})
    }
    const match =  await bcrypt.compare(password, user.password);
    
    if (match) {
        let dataForToken = {
            _id: user._id,
            email,
            role: user.role
        }
        const token = jwt.sign(dataForToken, process.env.JWTSECRET, { expiresIn: '3d' })
        return res.status(200).json({
            token,
            _id: user._id,
            email: user.email,
            profileImage: user.profileImg,
            role: user.role
        })
    }
    res.status(400).json({message: "Password is wrong"})
}

exports.signup = async (req, res, next) => {
    let { firstName, lastName, email, password, phoneNumber } = req.body;
    const isUser = await User.findOne({email});
    if (isUser) {
        return res.status(400).json({message: "This Email is used"})
    }
    let hashPassword = await bcrypt.hash(password, 10)
    if (!hashPassword) {
        return res.status(500).json({message: "something went wrong"})
    }
    password = hashPassword;
    let newUser = new User({firstName, lastName, email, password, phoneNumber});
    const save = await newUser.save()
    if (!save) {
        return res.status(400).json({message: save}) 
    }
    res.status(200).json({message: "User created Successfully"})
}

exports.adminSignup = async (req, res, next) => {
    let { firstName, lastName, email, password, phoneNumber } = req.body;
    const isUser = await User.findOne({email});
    if (isUser) {
        return res.status(400).json({message: "This Email is used"})
    }
    let hashPassword = await bcrypt.hash(password, 10)
    if (!hashPassword) {
        return res.status(500).json({message: "something went wrong"})
    }
    password = hashPassword;
    let newUser = new User({firstName, lastName, email, password, phoneNumber, role: "admin"});
    const save = await newUser.save()
    if (!save) {
        return res.status(400).json({message: save}) 
    }
    res.status(200).json({message: "admin created Successfully"})
}