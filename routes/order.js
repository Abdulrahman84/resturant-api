const router = require('express').Router();
const orderController = require('../controller/order')
const isValid = require('../middelwares/check');
const check = require('express-validator').check;
const guards = require('../middelwares/guards');
const CheckAndGetUserId = require('../middelwares/getUserId');
// {token, products, adress, amount, recieve, email, phone}
router.get('/',
    // guards.isAdmin,
    orderController.getOrders
)
router.get('/client/orders',
    CheckAndGetUserId,
    orderController.getClientOrder
)

router.post('/add', 
    CheckAndGetUserId,
    check("token").not().isEmpty().withMessage("token is undefined"),
    check("products").isArray().isLength({min: 1}).withMessage("token is undefined"),
    check("adress").custom((value, {req}) => {
        if (!value.city || value.city == "") 
            throw new Error("city can't be empty");
        if (!value.zone || value.zone == "") 
            throw new Error("zone can't be empty");
        if (!value.house || value.house == "") 
            throw new Error("house can't be empty");
        return true;
    }),
    check("amount").isNumeric().withMessage("amount must be a number"),
    check("recieve").not().isEmpty().withMessage("receive is undefined"),
    check("email").not().isEmpty().withMessage("email is required"),
    check("phone").not().isEmpty().withMessage("phone number is required")
    .isLength({min: 11, max: 11}).withMessage("you should add correct phone number"),
    isValid,
    orderController.addOrder
)
router.put('/complete/:orderid', 
    guards.isAdmin,
    orderController.completeOrder
)
router.put('/cancel/:orderid', 
    CheckAndGetUserId,
    orderController.cancelOrder
)
router.delete('/delete/:orderid', 
    guards.isAdmin,
    orderController.deleteOrder
)
module.exports = router;