const mongoose = require('mongoose');



const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    ip: {
        type: String,
        required: true
    },
    orderProducts: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "orderProduct"
            }
        ]
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    adress: {
        city: {
            type: String,
            required: true
        },
        zone: {
            type: String,
            required: true
        },
        house: {
            type: String,
            required: true
        }
    },
    paymentId: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    receiptUrl: {
        type: String,
        required: true
    },
    recieve: {
        type: String,
        enum: ["pick up", "delivery"],
        required: true
    },
    orderTime: {
        type: Number,
        default: 15
    },
    status: {
        type: String,
        enum: ["charged", "prepared", "canceled"],
        default: "prepared"
    },
    price: {
        type: Number,
        required: true
    }
}, { timestamps: true })

const Order = mongoose.model("order", orderSchema)
module.exports = Order;

