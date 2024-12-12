const express = require('express');
const router = express.Router();
const { ItemController } = require('../controler/ItemControler')
const itemController = new ItemController()
const { authentication, adminRole } = require("../midlewares/authentication")

router.get('/item', itemController.getItem)
router.get('/item/:id', itemController.getItembyId)
router.post('/itemproduct/:userId', authentication, itemController.addItem)
router.put('/item/:id', authentication, adminRole, itemController.updateItem)
router.delete('/item/:id', authentication, adminRole, itemController.deleteItem)

module.exports = router
