const stripe = require('stripe')("sk_test_51HkkefDHNiYh4mtD1YXl3fpM6wfVvRTWD81ANICazNdPOYb2mwik18G4dbTNfZK0E7oJq7JbW5r5qXPHrRqS0lkI00VgwQTR2V");
const Order = require('../model/order');
const OrderProducts = require('../model/orderProducts');
const Purchases = require('../model/purchases');
const mongoose = require('mongoose')

class OrdersAnylisis {
    constructor(orders) {
        this.orders = orders;
    };
    recieveOrders() {
        let pickUpOrders = [];
        let deliveryOrders = [];
        this.orders.forEach(order => {
            if (order.recieve == "pick up") 
                pickUpOrders.push(order);
            else 
                deliveryOrders.push(order)
        })
        return {
            pickUpOrders,
            pickUpOrdersLength : pickUpOrders.length,
            deliveryOrders,
            deliveryOrdersLength: deliveryOrders.length
        }
    }
    statusOrders() {
        let preparedOrders = [];
        let chargedOrders = [];
        this.orders.forEach(order => {
            if (order.status == "prepared") 
                preparedOrders.push(order);
            else
                chargedOrders.push(order);
        })
        return {
            preparedOrders,
            preparedOrdersLength : preparedOrders.length,
            chargedOrders,
            chargedOrdersLength : chargedOrders.length
        }
    }
    userOrders() {
        let usersOrders = [];
        let nonUsersOrders = [];
        this.orders.forEach(order => {
            if (order.user !== null) 
                usersOrders.push(order);
            else
                nonUsersOrders.push(order);
        })
        return {
            usersOrders,
            usersOrdersLength : usersOrders.length,
            nonUsersOrders,
            nonUsersOrdersLength: nonUsersOrders.length
        }
    }
}

exports.getOrders = async (req, res, next) => {
    let query = Order.find()
        .select("orderTime status user recieve price updatedAt")
        .sort({createdAt: 'desc'}) // asc
        // .select("status orderTime user recieve price updatedAt")
        

    try {
        let orders = await query.exec();
        if (orders.length == 0) {
            return res.status(200).json({
                message: "there aren't orders",
                orders: []
            })
        }
        let orderAnylisis = new OrdersAnylisis(orders);
        res.status(200).json({
            ordersLength: orders.length,
            recieveOrders: orderAnylisis.recieveOrders(),
            statusOrders: orderAnylisis.statusOrders(),
            usersOrders: orderAnylisis.userOrders()
        })
    } catch (error) {
        res.status(500).json({message: "something went wrong"})
    }
}


exports.getClientOrder = async (req, res, next) => {
    console.log(req.user)
    if (req.user) {
        let userOrder = await Order.findOne({user : req.user}).populate("orderProducts").exec();
        if (userOrder) {
            return res.status(200).json({
                order: userOrder,
            })
        } else {
            return res.status(400).json({
                order: null,
                message: "user doesn't have any order"
            })
        }
    } else {
        let ip = req.ip;
        let ipOrder = await Order.findOne({ip}).populate("orderProducts").select("adress recieve status orderProducts id");
        if (ipOrder) {
            return res.status(200).json({
                order: ipOrder,
            })
        } else {
            return res.status(400).json({
                order: null,
                message: "visitor doesn't have any order"
            })
        }
    }
}
exports.addOrder = async (req, res, next) => {
    const { token, products, adress, amount, recieve, email, phone } = req.body;
    let user = req.user ? req.user : null;
    let ip = req.ip
    await stripe.charges.create({
        amount:  amount * 100,
        currency: "usd",
        source: token, // obtained with Stripe.js
        description: `Some products have been charged ${amount}$ from the customer's card`
    }).then(async result => {
        try {
            let savesProducts = await OrderProducts.insertMany(products)
            if (savesProducts.length == 0) {
                return res.status(400).json({message: "no products to save"})
            } 
            var orderProducts = [];
            savesProducts.forEach(orderProduct => {
                orderProducts.push(orderProduct._id);  
            });
            let orderData = { 
                user,
                ip,
                orderProducts,
                email,
                phone,
                adress,
                paymentId: result.id,
                paymentMethod: result.payment_method_details.type, 
                receiptUrl: result.receipt_url, 
                recieve,
                price: amount 
            }
            let newOrder = new Order(orderData);
            let save = await newOrder.save();
            res.status(201).json({
                order: save,
                message: "your order has been added successfully"
            })
        } catch(error) {
            let deleteOrderProducts = await OrderProducts.deleteMany({_id: {$in: orderProducts}})
            if (deleteOrderProducts.n == 0) {
                return res.status(500).json({
                    message: "something went wrong",
                    error
                })
            }
            res.status(500).json({message: error})
        }
    }).catch((err) => {
        res.status(500).json({message: "something went wrong"});
    })
    
}
exports.completeOrder = async (req, res, next) => {
    let orderId = req.params.orderid;
    try {
        let deletingOrder = await Order.findByIdAndDelete(orderId);
        if (!deletingOrder) {
            return res.status(400).json({message: "order not found", success: false})
        } 
        let { orderProducts, phone, user, paymentId, paymentMethod, receiptUrl, recieve, price } = deletingOrder;
        let newPurchases = new Purchases({ 
            orderProducts,
            phone, 
            user, 
            paymentId, 
            paymentMethod, 
            receiptUrl, 
            recieve, 
            price 
        })
        let save = await newPurchases.save();
        res.status(200).json({
            message: "order is compeleted successfully",
            success: true
        })
    } catch (error) {
        res.status(500).json({
            message: "something went wrong",
            error,
            success: false
        })
    }
}
exports.cancelOrder = async (req, res, next) => {
    let orderid = req.params.orderid;
    let ip = req.ip

    try {
        let order = await Order.findOne({_id: mongoose.Types.ObjectId(orderid), ip})
        if (!order) {
            res.status(500).json({message: "order not found to cancel"})
        } else {
            if (order.status != "prepared") {
                return res.status(200).json({
                    message: `your order is ${order.status}, can't cancel it`,
                    cancel: false
                })
            }
            let cancel = await Order.findByIdAndUpdate(
                order.id, {status : "canceled"}, {new: true} 
            )
            if (cancel) {
                return res.status(200).json({
                    message: "order has been canceled successfully",
                    cancel: true
                })
            } else {
                return res.status(500).json({
                    message: `something went wrong can't cancel this order`,
                    cancel: false
                })
            }
        }
    } catch(error) {
        return res.status(500).json({
            message: `something went wrong can't cancel this order`,
            cancel: false
        })
    }
}
exports.deleteOrder = async (req, res, next) => {
    const orderId = req.params.orderid;
    try {
        let deletingOrder = await Order.findByIdAndDelete(orderId)
        if (!deletingOrder) {
            return res.status(200).json({message: "order of this id is not found"} )
        } 
        if (deletingOrder) {
            let deletingOrderProducts = await OrderProducts.deleteMany({_id: {$in: deletingOrder.orderProducts}});
            console.log(deletingOrderProducts)
            return res.status(200).json({
                message: "order has been deleted succcessfully"
            })
        }
    } catch(error) {
        res.status(500).json({
            message: "something went wrong"
        })
    }
}
