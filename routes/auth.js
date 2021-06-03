const router = require('express').Router();
const userController = require('../controller/auth')
const isValid = require('../middelwares/check'); 
const check = require('express-validator').check;


router.post('/signin', 
check("email").not().isEmpty().withMessage("Can't be Empty"),
check("password").not().isEmpty().withMessage("Can't be Empty"),

 isValid , userController.signin)
router.post('/signup', 
    check("firstName").not().isEmpty().withMessage("Can't be Empty"),
    check("lastName").not().isEmpty().withMessage("Can't be Empty"),
    check("email").not().isEmpty().withMessage("Can't be Empty"),
    check("phoneNumber").not().isEmpty().withMessage("Can't be Empty"),
    check("password").not().isEmpty().withMessage("Can't be Empty"),
    check("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        return true;
      })
, isValid ,userController.signup)
router.post('/admin/signup', 
    check("firstName").not().isEmpty().withMessage("Can't be Empty"),
    check("lastName").not().isEmpty().withMessage("Can't be Empty"),
    check("email").not().isEmpty().withMessage("Can't be Empty"),
    check("phoneNumber").not().isEmpty().withMessage("Can't be Empty"),
    check("password").not().isEmpty().withMessage("Can't be Empty"),
    check("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        return true;
      })
, isValid ,userController.adminSignup)
module.exports = router;