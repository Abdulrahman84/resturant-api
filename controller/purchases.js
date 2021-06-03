const Purchases = require('../model/purchases');
const Category = require('../model/category')
exports.anylisis = async (req, res, next) => {
    // get purchases from data base
    let query = Purchases.find().populate(
            {
                path: "orderProducts", populate: "product"
            }
    );
    let purchases = await query.exec()
    
    // anylisis
    let purchasesAnylisis = new Anylisis(purchases)
    let category = await purchasesAnylisis.getCategoryPurchases();
    let users = purchasesAnylisis.usersPurchases();
    let recieves = purchasesAnylisis.recieves();

    // response
    res.status(200).json({
        category,
        users,
        recieves
    })
}
class Anylisis {
    constructor (purchases) {
        this.purchases = purchases;
        this.name
    }
    async getCategoryPurchases() {
        /*
            1- looping in category
            2- filter purchases
            3- filter order products
        */
        const CategoriesNames = await Category.find().select("name");
        let categoryPurchases = CategoriesNames.map(category => {
            let filterPurchases = this.purchases.filter(purchas => {
                    return purchas.orderProducts.filter(orderProduct => {
                        return orderProduct.product.category === category.name? orderProduct: null;
                    })
            })
            return {
                category: category.name,
                categoryPurchases: filterPurchases,
                length : filterPurchases.length
            }
        })
        return categoryPurchases;
    }
    
    usersPurchases() {
        let purchasesLength =  this.purchases.length;
        let usersPurchasesLength = 0; 
        this.purchases.forEach(purchas => {
            purchas.user !== null ? usersPurchasesLength++: false; 
        });
        
        let nonUsersPurchasesLength = purchasesLength - usersPurchasesLength;
        return {
            purchasesLength,
            usersPurchasesLength,
            nonUsersPurchasesLength
        }
    }
    recieves() {
        let pickUp = 0;
        let delivery = 0;
        // looping to check recieves in purhcases
        this.purchases.forEach(purchas => {
            purchas.recieve == "pick up" ? pickUp++ : delivery++; 
        });
        return {
            pickUp,
            delivery
        };
    }
}
exports.getPurchasesById = async (req, res, next) => {
    let purchaseId = req.params.id;
    let query = Purchases.findById(purchaseId);
        query.populate("orderProducts")
    try  {
        let purchase = await query.exec()
        res.status(200).json({purchase})
    } catch (err) {
        res.status(500).json({
            message: "something went wrong"
        })
    }
}