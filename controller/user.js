const User = require('../model/user');
const fs = require('fs');
let uploadsPath =  __dirname.replace("controller", "uploads") + '\\' ;
const Order = require('../model/order');
const Purchases = require('../model/purchases'); 

exports.getAllUsers = async (req, res, next) => {
     const users = await User.find({role: "user"});
     if (users.length == 0)
          res.status(200).json({
               users: false,
               message: "no users"
          })
     else 
          res.status(200).json({
               users
          })
}
exports.getUserProfile = async (req, res, next) => {
     const email = req.email;
     try {
          const user = await User.findOne({email});
          if (!user) {
               return res.status(400).json({
                    profile: false,
                    message: "you don't have account"
               })
          }
          const orders = await Order.find({email});
          const purchases = await Purchases.find({user: user._id})
          res.status(200).json({
               profile: user,
               orders,
               purchases
          })
     } catch (err) {
          res.status(500).json({
               profile: false,
               message: "something went wrong"
          })
     } 
}
exports.updateImageProfile = async (req, res, next) => {
     if (req.fileFilterError) {
          return res.status(400).json(req.fileFilterError);
     }
     if (!req.file) {
          return res.status(400).json({message: "you should select file"});
     }
     const newImage = req.file.filename;
     try {
          let userLastData = await User.findOne({email: req.email}).selected("profileImg");
          if (userLastData.profileImg !== 'user.png') {
               fs.unlinkSync(uploadsPath + userLastData.profileImg);
          } 
          let query = User.findOneAndUpdate({email: req.email}, {profileImg: newImage}, {new: true})
          let update = await query.exec()
          
          if (!update) {
               fs.unlinkSync(uploadsPath + newImage);
               return res.status(400).json({
                    update: false,
                    message: "Can't update your profile image"
               })
          } 
          res.status(200).json({
               update: true,
               message: "profile image is updated successfully"
          })
     } catch (error) {
          fs.unlinkSync(uploadsPath + newImage);
          res.status(400).json({
               update: false,
               message: "Can't update your profile image"
          })
     }
}
