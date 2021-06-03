const Product = require('../model/product');
const slugify = require('slugify')
const fs = require('fs')
const Category = require('../model/category');
let uploadsPath =  __dirname.replace("controller", "uploads") + '\\' ;

exports.getAllproducts = async (req, res, next) => {
    const query = Product.find()
    query.select("_id name category image")
    let products = await query.exec();
    products = products.map(product => {
        return {
            id: product._id,
            name: product.name,
            category: product.category,
            image: process.env.URL + product.image,
            productPage: {
                method: "GET",
                url: process.env.URL + "api/products/" + product.id
            },
        }
    })
    if (products.length > 0)
        return res.status(200).json({products})
    if (!products) 
        return res.status(500).json({message: "something went wrong"});
    if (products.length == 0) 
        return res.status(200).json({message: "There are no products"});
}
exports.getProduct = async (req, res, next) => {
    const id = req.params.productId;
    const product = await Product.findById(id);
    if (!product) {
        return res.status(500).json({message: "something went wrong"})
    }
    res.status(200).json({
        id: product.id,
        name: product.name,
        category: product.category,
        image: process.env.URL + product.image,
        descripition: product.descripition,
        toppings: product.toppings,
        defaultTopping: product.defaultTopping,
        specialsAdditions: product.specialsAdditions,
        pieces: product.pieces,
        sizes: product.sizes,
        price: product.price,
        delete: {
            method: "DELETE",
            url: process.env.URL + "api/products/delete",
            body: { id: product.id }
        },
        update: {
            method: "POST",
            url: process.env.URL + "api/products/update",
            body : {
                id: product.id,
                data: "you should select it"
            }
        }
    }) 
}


exports.addProduct = async (req, res, next) => {
    if (req.fileFilterError) {
        return res.status(400).json(req.fileFilterError);
    }
    if (!req.file) {
        return res.status(400).json({message: "you should select file"});
    }
    let {name, descripition, category , sizes, toppings, pieces , specialsAdditions, price} = req.body;
    if (typeof(sizes) !== "undefined") {
        sizes = JSON.parse(sizes);
    } 
    if (typeof(toppings) !== "undefined") {
        toppings = JSON.parse(toppings);
    } 
    if (typeof(specialsAdditions) !== "undefined") {
        specialsAdditions = JSON.parse(specialsAdditions);
    } 
    if (typeof(pieces) !== "undefined") {
        pieces = JSON.parse(pieces);
    }
    let slug = slugify(name);
    let productData = {
        name,
        descripition,
        category ,
        sizes, 
        toppings,
        pieces , 
        specialsAdditions, 
        price,
        slug,
        image: req.file.filename 
    }
    try {
        const product = new Product(productData)
        const save = await product.save();
        const checkProductCategory = await Category.findOne({name: save.category});
        if (checkProductCategory) {
            const updateCategory = await Category.findByIdAndUpdate(checkProductCategory._id, {$addToSet: {products: save._id}}, {new: false})
        } else {
            const newCategoryData = {
                name: category,
                products: [save._id],
                slug: slugify(category)
            }
            const newCategory = new Category(newCategoryData);
            await newCategory.save();
        }
        res.status(201).json({
            message: "product is added successfully",
            id: save.id,
            name: save.name,
            category: save.category,
            image: process.env.URL + save.image,
            descripition: save.descripition,
            toppings: save.toppings,
            sizes: save.sizes,
            specialsAdditions: save.specialsAdditions,
            pieces: save.pieces,
            price: save.price,
        })
        
    } catch (error) {
        console.log(error.code);
        fs.unlinkSync(uploadsPath + req.file.filename)
        if (error.code == 11000) {
            res.status(400).json({message: "there are product with this name"})
        } else {
            res.status(500).json({message: "something went wrong"})
        }
    }
}
exports.deleteProduct = async (req, res, next) => {
    const { id } = req.body;
    const deleteProduct = await Product.findByIdAndDelete(id);
    if (deleteProduct) { 
        return fs.unlink(uploadsPath + deleteProduct.image, (err)=> {  
            if (err) 
                res.status(500).json({message: "something went wrong"})
            else 
                res.status(200).json({message: "product is deleted successfully"})
        });
    }
    res.status(500).json({message: "something went wrong"});
}
exports.updateProduct =  (req, res, next) => {
    const { id , newData } = req.body;
    if (!id) {
        return res.status(400).json({message: "can't update product without id"})
    }
    Product.findByIdAndUpdate(id, newData, {new: true}, (err, update) => {
        if (update) {
            return res.status(200).json({
                message: "product is updated successfully",
                id: update.id,
                name: update.name,
                category: update.category,
                image: process.env.URL + update.image,
                descripition: update.descripition,
                toppings: update.toppings,
                sizes: update.sizes,
                specialsAdditions: update.specialsAdditions,
                pieces: update.pieces,
                price: update.price,
            })
        } 
        res.status(500).json({message: "Something went wrong"})
    });
    
}
exports.updateProductImage = async (req, res, next) => {
    const image = req.file.filename;
    if (!image) {
        return res.status(400).json({message: "you should select an image"})
    }
    const id  = req.body.id; 
    if (!id) {
        fs.unlinkSync(uploadsPath + image)
        return res.status(400).json({message: "can't update product with this image"})
    }
    try {
        const product = await Product.findByIdAndUpdate(id, {image}, {new: false});
        fs.unlinkSync(uploadsPath + product.image);
        res.status(200).json({
            message: "product image is updated",
            newImage: process.env.URL + image
        })
    } catch (error) {
        fs.unlinkSync(uploadsPath + image);
        res.status(500).json({message: "something went wrong"})
    }  
}




/*
let data;
    let error = validationResult(req).array();
    if (category == "pizza") {
        data = {name ,descripition, category, sizes, toppings, defaultTopping , specialsAdditions }
        let checkErrResult = checkErr(data, error);
        if(checkErrResult) {
            await fs.unlinkSync(uploadsPath + req.file.filename)
            return res.status(400).json({error: checkErrResult});
        }
    } else if (category == "drink") {
        data = {name ,descripition, category, sizes }
        let checkErrResult = checkErr(data, error);
        if(checkErrResult) {
            await fs.unlinkSync(uploadsPath + req.file.filename)
            return res.status(400).json({error: checkErrResult});
        }
    } else if (category == "salads") {
        data = {name ,descripition, category, sizes, toppings }
        let checkErrResult = checkErr(data, error);
        if(checkErrResult) {
            await fs.unlinkSync(uploadsPath + req.file.filename)
            return res.status(400).json({error: checkErrResult});
        }
    } else if (category == "starters") {
        data = {name ,descripition, category, sizes }
        let checkErrResult = checkErr(data, error);
        if(checkErrResult) {
            await fs.unlinkSync(uploadsPath + req.file.filename)
            return res.status(400).json({error: checkErrResult});
        }
    } else if (category == "pasta") {
        data = {name ,descripition, category, price }
        let checkErrResult = checkErr(data, error);
        if(checkErrResult) {
            await fs.unlinkSync(uploadsPath + req.file.filename)
            return res.status(400).json({error: checkErrResult});
        }
    } else if (category == "desert") {
        data = {name ,descripition, category, price }
        let checkErrResult = checkErr(data, error);
        if(checkErrResult) {
            await fs.unlinkSync(uploadsPath + req.file.filename)
            return res.status(400).json({error: checkErrResult});
        }
    } else {
        await fs.unlinkSync(uploadsPath + req.file.filename)
        return res.status(400).json({message : "should select correct category"})
    }
*/