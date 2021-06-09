const router = require("express").Router();
const { check } = require("express-validator");
const productsController = require("../controller/product");
const { upload } = require("../uploader/adminuploads");
const guards = require("../middelwares/guards");
const isValid = require("../middelwares/check");
router.get("/", guards.isAdmin, productsController.getAllproducts);
router.get("/product/:productId", productsController.getProduct);
router.post(
  "/add",
  guards.isAdmin,
  upload.single("image"),
  check("name").not().isEmpty().withMessage("name can't be empty"),
  check("category").not().isEmpty().withMessage("category can't be empty"),
  check("descripition")
    .not()
    .isEmpty()
    .withMessage("description can't be empty"),
  isValid,
  productsController.addProduct
);
router.delete("/delete", guards.isAdmin, productsController.deleteProduct);
router.put("/update", guards.isAdmin, productsController.updateProduct);
router.put(
  "/image/update",
  guards.isAdmin,
  upload.single("image"),
  productsController.updateProductImage
);

// router.get('/index', productsController.getProductsIndex)
// router.get('/bestseller', productsController.getBestSeller)
// router.get('/offers', productsController.getTopRank)

module.exports = router;
