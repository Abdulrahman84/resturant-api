const Category = require('../model/category');
const slugify  = require('slugify');
const Product = require('../model/product');
const fs = require('fs');
let uploadsPath =  __dirname.replace("controller", "uploads") + '\\' ;





exports.getAllCategories = async (req, res, next) => {    
    let categories = await Category.find().populate('products');
    if (categories.length > 0){
        return res.status(200).json({categories})
    }
    if (!categories) {
        return res.status(500).json({message: "something went wrong"})
    }
    if (categories.length == 0) {
        return res.status(200).json({message: "no category"})
    }
}
exports.getCategoriesNames= async (req, res, next) => {
    try {
        let query = Category.find().select('name')
        const categories = await query.exec();
        let categoriesNames = categories.map(category => category.name)
        res.status(200).json({categoriesNames, length: categoriesNames.length})
    } catch (err) {
        res.status(200).json({message: "something went wrong"})
    }
    
}
exports.getCategoryById = async (req, res, next) => {
    const id = req.params.categoryid;
    if (!id) {
        return res.status(400).json({message: "must add name of category do you want it"})
    }
    try {
        const category = await  Category.findById(id).populate('products');
        if (!category) {
            return res.status(200).json({message: "can't find category with this name"})
        }
        res.status(200).json({category})
    } catch (err) {
        res.status(500).json({message: "something went wrong"})
    }
}
exports.updateCategoryName = async (req, res ,next) => {
    let {name} = req.body;
    const id = req.params.categoryid;
    if (!id) {
        return res.status(400).json({message: "can't update category without id"})
    }
    try {
        let slug = slugify(name);
        const updateCategoryName = await Category.findByIdAndUpdate(id, {name, slug}, {new: false});
        if (name === updateCategoryName.name) {
            return res.status(400).json({message: "The old name is the same as the new name"});
        } 
        const updateCategoryNameInProducts = await
            Product.updateMany(
                {_id: {$in: updateCategoryName.products }},
                {category: name},
                {new: true}
            )
        res.status(200).json({message: "updated product is successfully"})
    } catch (err) {
        res.status(500).json({message: "somethin went wrong"})
    }
}
exports.deleteCategory = async (req, res, next) => {
    const id = req.params.categoryid
    if (!id) {
        return res.status(400).json({message: "you can't delete category without id"})
    }
    try {
        const deleteCategory = await Category.findByIdAndDelete(id)
        if (deleteCategory) {
            const products = await Product.find(
                {_id: {$in: deleteCategory.products}}).select("image").exec();
            const deleteProducts = await Product.deleteMany(
                {_id: {$in: deleteCategory.products}})
            
            if (products && deleteProducts) {
                products.forEach(product => fs.unlinkSync(uploadsPath + product.image))
                return  res.status(200).json({message: "All product of this category deleted successfully"})
            }
            res.status(500).json({message: "something went wrong"})
        }
    } catch (err) {
        res.status(500).json({message: "something went wrong"})
    }
}