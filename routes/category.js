const router = require('express').Router();
const categoryController = require('../controller/Category');
const guards = require('../middelwares/guards');
router.get('/', categoryController.getAllCategories)
router.get('/names', categoryController.getCategoriesNames)
router.get('/get/:categoryid', categoryController.getCategoryById)
router.put('/update/:categoryid', guards.isAdmin, categoryController.updateCategoryName)
router.delete('/delete/:categoryid', guards.isAdmin, categoryController.deleteCategory)
module.exports =  router;