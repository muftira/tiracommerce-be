const express = require('express');
const router = express.Router();
const {UserController} = require('../controler/UserControler')
const userController = new UserController
const midleware = require("../midlewares/authentication")

router.get('/user', midleware.authentication, userController.getUser)
router.get('/user/:id', midleware.authentication, userController.getUserbyId)

// register user
router.post('/userregister', userController.addUser)

//login user
router.post('/userlogin', userController.loginUser)

router.put('/user/:id', midleware.authentication, userController.updateUser)
router.delete('/user/:id', midleware.authentication, userController.deleteUser)


module.exports = router
