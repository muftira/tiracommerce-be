const express = require('express');
const router = express.Router();
const {UserController} = require('../controler/UserControler')
const userController = new UserController
const {authentication, adminRole} = require("../midlewares/authentication")

router.get('/user', authentication, adminRole, userController.getUser)
router.get('/user/:id', authentication, adminRole, userController.getUserbyId)

// register user
router.post('/userregister', userController.addUser)

//login user
router.post('/userlogin', userController.loginUser)

router.put('/user/:id', authentication, userController.updateUser)
router.delete('/user/:id', authentication, adminRole, userController.deleteUser)


module.exports = router
