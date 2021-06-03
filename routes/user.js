const router = require('express').Router();
const guards = require('../middelwares/guards');
const userController = require('../controller/user');
router.get('/',  userController.getAllUsers);
router.get('/user', guards.isUser, userController.getUserProfile);
router.put('/image/update', guards.isUser, userController.updateImageProfile);
module.exports = router;