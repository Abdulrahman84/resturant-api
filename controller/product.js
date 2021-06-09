const Product = require("../model/product");
const slugify = require("slugify");
const Category = require("../model/category");
const { cloudinary } = require("../uploader/adminuploads");

exports.getAllproducts = async (req, res, next) => {
  const query = Product.find();
  query.select("_id name category image");
  let products = await query.exec();
  products = products.map((product) => {
    return {
      id: product._id,
      name: product.name,
      category: product.category,
      image: product.image,
      productPage: {
        method: "GET",
        url: process.env.URL + "api/products/" + product.id,
      },
    };
  });
  if (products.length > 0) return res.status(200).json({ products });
  if (!products)
    return res.status(500).json({ message: "something went wrong" });
  if (products.length == 0)
    return res.status(200).json({ message: "There are no products" });
};
exports.getProduct = async (req, res, next) => {
  const id = req.params.productId;
  const product = await Product.findById(id);
  if (!product) {
    return res.status(500).json({ message: "something went wrong" });
  }
  res.status(200).json({
    id: product.id,
    name: product.name,
    category: product.category,
    image: product.image,
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
      body: { id: product.id },
    },
    update: {
      method: "POST",
      url: process.env.URL + "api/products/update",
      body: {
        id: product.id,
        data: "you should select it",
      },
    },
  });
};

exports.addProduct = async (req, res, next) => {
  try {
    if (req.fileFilterError) {
      return res.status(400).json(req.fileFilterError);
    }
    if (!req.file) {
      return res.status(400).json({ message: "you should select file" });
    }
    let {
      name,
      descripition,
      category,
      sizes,
      toppings,
      pieces,
      specialsAdditions,
      price,
    } = req.body;
    if (typeof sizes !== "undefined") {
      sizes = JSON.parse(sizes);
    }
    if (typeof toppings !== "undefined") {
      toppings = JSON.parse(toppings);
    }
    if (typeof specialsAdditions !== "undefined") {
      specialsAdditions = JSON.parse(specialsAdditions);
    }
    if (typeof pieces !== "undefined") {
      pieces = JSON.parse(pieces);
    }
    let photo;
    let cl_id;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      photo = result.secure_url;
      cl_id = result.public_id;
    } else {
      photo = null;
      cl_id = null;
    }
    let slug = slugify(name);
    let productData = {
      name,
      descripition,
      category,
      sizes,
      toppings,
      pieces,
      specialsAdditions,
      price,
      slug,
      image: photo,
      cloudinary_id: cl_id,
    };
    const product = new Product(productData);
    const save = await product.save();
    const checkProductCategory = await Category.findOne({
      name: save.category,
    });
    if (checkProductCategory) {
      const updateCategory = await Category.findByIdAndUpdate(
        checkProductCategory._id,
        { $addToSet: { products: save._id } },
        { new: false }
      );
    } else {
      const newCategoryData = {
        name: category,
        products: [save._id],
        slug: slugify(category),
      };
      const newCategory = new Category(newCategoryData);
      await newCategory.save();
    }
    res.status(201).json({
      message: "product is added successfully",
      id: save.id,
      name: save.name,
      category: save.category,
      image: save.image,
      cloudinary_id: save.cloudinary_id,
      descripition: save.descripition,
      toppings: save.toppings,
      sizes: save.sizes,
      specialsAdditions: save.specialsAdditions,
      pieces: save.pieces,
      price: save.price,
    });
  } catch (error) {
    if (error.code == 11000) {
      res
        .status(400)
        .json({ message: "there is already a product with this name" });
    } else {
      res.status(400).send({ error: "please upload an image" });
    }
  }
};
exports.deleteProduct = async (req, res, next) => {
  try {
    const _id = req.body.id;
    const product = await Product.findByIdAndRemove(_id);
    console.log(product);
    if (!product) return res.send({ message: "no product found" });
    res.send({ message: "deleted" });

    await cloudinary.uploader.destroy(product.cloudinary_id);
  } catch (err) {
    res.status(500).json({ message: "something went wrong " + err });
  }
};
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id)
      return res
        .status(400)
        .send({ message: "can't update product without id" });
    const {
      name,
      category,
      descripition,
      toppings,
      sizes,
      image,
      specialsAdditions,
      pieces,
      price,
    } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body);
    if (!updatedProduct)
      return res.status(404).send({ error: "No product found" });
    res.send({
      message: "product is updated successfully",
      name,
      category,
      descripition,
      toppings,
      sizes,
      specialsAdditions,
      pieces,
      price,
    });
  } catch (err) {
    if (err.code == 11000)
      return res.send({
        message: "there is already a product with this name ",
      });
    res.status(500).send({ message: "Something went wrong " + err });
  }
};
exports.updateProductImage = async (req, res, next) => {
  let photo;
  let cl_id;
  if (!req.file) {
    photo = null;
    cl_id = null;
    return res.status(400).send({ message: "please upload a file" });
  }
  if (!req.file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return res.send({ error: "Please upload an image" });
  }
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    photo = result.secure_url;
    cl_id = result.public_id;
  }
  const id = req.body.id;
  if (!id) {
    return res.status(400).json({ message: "can't update product with no id" });
  }
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { image: photo },
      { new: true }
    );
    if (!product) return res.status(404).send({ mssage: "no product found" });
    res.status(200).send({
      message: "product image is updated",
      newImage: product.image,
    });
  } catch (error) {
    res.status(500).send({ message: "something went wrong " + error });
  }
};

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
