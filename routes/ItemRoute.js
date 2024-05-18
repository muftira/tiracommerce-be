const express = require('express');
const router = express.Router();
const {ItemController }= require('../controler/ItemControler')
const itemController = new ItemController()
const midleware = require("../midlewares/authentication")

router.get('/item',  itemController.getItem)
router.get('/item/:id', itemController.getItembyId)
router.post('/itemproduct/:userId', midleware.authentication, itemController.addItem)
router.put('/item/:id', midleware.authentication, itemController.updateItem)
router.delete('/item/:id', midleware.authentication, itemController.deleteItem)

module.exports = router
