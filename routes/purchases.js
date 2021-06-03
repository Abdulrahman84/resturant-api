const router = require('express').Router();
const purchasesController = require('../controller/purchases');
const guards = require('../middelwares/guards')
router.get('/anylisis', 
    guards.isAdmin,
    purchasesController.anylisis
)
router.post('/:id',
    guards.isAdmin, 
    purchasesController.getPurchasesById
)

module.exports = router;