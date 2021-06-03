const mongoose = require('mongoose');
const purchasesSchema = mongoose.Schema({
    orderProducts: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "orderProduct"
            }
        ]
    },
    phone: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
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
    price: {
        type: Number,
        required: true
    }
}, {timestamps: true})


const Purchases = mongoose.model("purchase", purchasesSchema);

module.exports = Purchases;