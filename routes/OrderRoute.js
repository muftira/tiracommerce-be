const express = require('express');
const router = express.Router();
const {OrderController} = require('../controler/OrderControler')
const orderController = new OrderController
const midleware = require("../midlewares/authentication")

router.get('/order', midleware.authentication, orderController.getOrder)
router.get('/order/:id', midleware.authentication, orderController.getOrderbyId)
router.post('/order/:userId/:cartId', midleware.authentication, orderController.addOrder)

//update property statusOrder
router.put('/order/:id', midleware.authentication, orderController.updateOrder)

router.delete('/order/:id', midleware.authentication, orderController.deleteOrder)

module.exports = router