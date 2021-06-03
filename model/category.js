const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: [true, "there are category with this name"]
    },
    slug: {
        type: String, 
        required: true
    },
    products: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product"
            }
        ],
        default: []
    }
}, { timestamps: true })

const Category = mongoose.model("categorie", categorySchema);
module.exports = Category;