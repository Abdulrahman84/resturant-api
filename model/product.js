const mongoose = require('mongoose');

const prodcutSchema = mongoose.Schema({
    name: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    descripition: {
        type: String,
        required: true
    }, 
    category: {
        type: String,
        required: true
    },
    sizes: {
        type: [
            {
                size: String,
                price: Number
            }
        ],
        default: []
    },
    toppings: {
        type: [
            {
                topping: String,
                sizes: [
                    {
                        size: String,
                        price: Number
                    }
                ]
            }
        ]
    }
    ,
    specialsAdditions: {
        type: [
            {
                addition: String,
                sizes: [
                    {
                        size: String,
                        price: Number
                    }
                ]
            }
        ]
    },
    pieces: {
        type: [
            {
                pieces: Number,
                price: Number
            }
        ]
    },
    price: Number,
    image: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Product = mongoose.model('product', prodcutSchema);

module.exports = Product;