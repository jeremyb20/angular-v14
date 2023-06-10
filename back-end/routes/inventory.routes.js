const { Router } = require('express');
const inventoryCtl = require('../controllers/inventory.controller.js')
const router = Router();
const verification = require('./../config')

router.get('/getAllInventory', verification, inventoryCtl.getAllInventory);

router.post('/createInventory',verification, inventoryCtl.createInventory);

router.get('/getInventoryById?:id', verification, inventoryCtl.getInventoryById);

router.post('/editInventory',verification, inventoryCtl.editInventory);

router.delete('/deleteInventory?:id',verification, inventoryCtl.deleteInventory);

module.exports = router;
