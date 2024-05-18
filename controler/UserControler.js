const { User, Order, Cart, Item, sequelize } = require('../models')
const Validator = require('fastest-validator')
const v = new Validator()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config({path: '.env'})
const JWT_SECRET = process.env.JWT_SECRET
const SuccessResponse = require('../helpers/Success.helper')
const ErrorResponse = require('../helpers/error.helper')

class UserController {
    async getUser(req, res, next){
        try {
            const result = await User.findAll({
                include: [{
                    model: Order
                },
                {
                    model: Cart,
                    include: {
                        model: Item
                    }
                }
            ]
            })
    
    
            // const result = await User.findAll({
            //     attributes: [[sequelize.fn("COUNT", sequelize.col("Items.id")), "total"]],
            //     raw:true,
            //     group: "Items.id",
            //     include: [{
            //         model: Item
            //     }]
            // })
            
            // res.status(200).json({
            //     message: 'Success',
            //     data: result
            // })
            return new SuccessResponse(res, 200, result, 'Success')
        } catch (error) {
            // console.log("RESULT =>", error);
            // res.json({
            //     message: 'User Data Failed',
            //     data: error
            // })
            next(error)
        }
    }
    
    async getUserbyId(req, res, next){
        try {
            const {id} = req.params
            const result = await User.findOne({where: {id}, 
                include: [{
                    model: Order
                },
                {
                    model: Cart,
                    include: {
                        model: Item
                    }
                }
            ]
        })
            // res.status(200).json({
            //     message: 'Success',
            //     data: result
            // })
            return new SuccessResponse(res, 200, result, 'Success')
        } catch (error) {
            // res.json({
            //     message: 'User Data Failed',
            //     data: error
            // })
            next(error)
        }
    }
    
    async addUser(req, res, next){
        try {
            const {fullName,email, password, address, phone} = req.body
            const checkUser = await User.findOne({where: {email}})
            const schema = {
                email: {type: "email", optional: false},
                password: {type: "string", min: 5, max: 255, optional: false}
            }
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            
    
            if(checkUser){
                // validate Email
                if(checkUser.dataValues.email == email){
                    //     res.status(401).json({
                    //     message: 'Email Already Exist',
                    //     data: {}
                    // })
                    throw new ErrorResponse(401, {}, 'Email Already Exist')
                }else{
                    // Validate Data
                     const validationResult = v.validate({email, password}, schema)
    
                    if(validationResult !== true){
                    // res.status(401).json({
                    // message: 'Validation Failed',
                    // data: validationResult
                    //     })
                    throw new ErrorResponse(401, validationResult, 'Validation Failed')
                    }else{
                        const result = await User.create({fullName,email, password: hash, address, phone})
                        // res.status(201).json({
                        // message: 'Success',
                        // data: result
                        // })
                        return new SuccessResponse(res, 200, result, 'Success')
                    }      
                }
            }else{
                // Validate Data
                const validationResult = v.validate({email, password}, schema)
    
                if(validationResult !== true){
                    // res.status(401).json({
                    // message: 'Validation Failed',
                    // data: validationResult
                    //  })
                    throw new ErrorResponse(401, validationResult, 'Validation Failed')
                }else{
                    const result2 = await User.create({fullName, email, password: hash, address, phone})
                    // res.status(201).json({
                    // message: 'Success',
                    // data: result2
                    // })
                    return new SuccessResponse(res, 201, result2, 'Success')
                }
                    
            }
            
        } catch (error) {
            // res.json({
            //     message: 'Add User Failed',
            //     data: error
            // })
            next(error)
        }
    }
    
    async loginUser(req, res, next){
        try {
            const {email, password} = req.body
            const checkUser = await User.findOne({where: {email}})

            if (!checkUser) {
                // return  res.status(401).json({
                //     message: 'Email not Found',
                //     data: {}
                // }) 
                throw new ErrorResponse(401, {}, 'Email not Found')
            }

            const checkPassword = bcrypt.compareSync(password, checkUser.dataValues.password);

            if (!checkPassword) {
                // return  res.status(401).json({
                //     message: 'Wrong Password',
                //     data: {}
                // }) 
                throw new ErrorResponse(401, {}, 'Wrong Password')
            }
    
            const _token = jwt.sign({email, id: checkUser.dataValues.id}, JWT_SECRET, { expiresIn: '24h' });

            return  res.status(200).json({
                status: true,
                message: 'Login success',
                token: _token,
                data: checkUser
            }) 

            // if(checkUser) {
            //    const checkPassword = bcrypt.compareSync(password, checkUser.dataValues.password);
            //     if(checkPassword){
            //         var _token = jwt.sign({email, id: checkUser.dataValues.id}, JWT_SECRET, { expiresIn: '24h' });
            //         res.status(200).json({
            //             message: 'Login success',
            //             token: _token,
            //             data: checkUser
            //         }) 
            //     }else{
            //         res.status(401).json({
            //             message: 'Wrong Password',
            //             data: {}
            //         }) 
            //     }
            // }else{
            //     res.status(401).json({
            //         message: 'Email not Found',
            //         data: {}
            //     }) 
            // }
            
        } catch (error) {
            // res.status(500).json({
            //     message: 'Login User Failed',
            //     data: error
            // })
            next(error)
        }
    }
    
    async updateUser(req, res, next){
        try {
            const {id} = req.params
            const {fullName, email, password, address, phone} = req.body
            const checkUser = await User.findOne({where: {id}})
            const schema = {
                email: {type: "email", optional: true},
                password: {type: "string", min: 5, max: 255, optional: true}
            }
    
            if(checkUser){
                // Validate Email
                if(checkUser.dataValues.email == email){
                    // res.status(401).json({
                    //     message: 'Email Already Exist',
                    //     data: {}
                    // })
                    throw new ErrorResponse(401, {}, 'Email Already Exist')
                }else{
                    // Validate Data
                    const validationResult = v.validate({email, password}, schema)
    
                    if(validationResult !== true){
                    // res.status(401).json({
                    // message: 'Validation Failed',
                    // data: validationResult
                    //     })
                    throw new ErrorResponse(401, validationResult, 'Validation Failed')
                    }else{
                        const result = await User.update({fullName, email, password, address, phone},{
                            where : {
                                id
                            }
                        })
                        // res.status(200).json({
                        //     message: 'Success',
                        //     data: result
                        // })
                        return new SuccessResponse(res, 200, result, 'Success')
                    }     
                }
            }else{
                // Validate Data
                const validationResult = v.validate({email, password}, schema)
    
                if(validationResult !== true){
                // res.status(401).json({
                // message: 'Validation Failed',
                // data: validationResult
                //     })
                throw new ErrorResponse(401, validationResult, 'Validation Failed')
                }else{
                    const result2 = await User.update({fullName, email, password, address, phone},{
                        where : {
                            id
                        }
                    })
                    // res.status(200).json({
                    //     message: 'Success',
                    //     data: result2
                    // })
                    return new SuccessResponse(res, 200, result2, 'Success')
                }     
            }
    
            
        } catch (error) {
            // res.json({
            //     message: 'Add User Failed',
            //     data: error
            // })
            next(error)
        }
    }
    
    async deleteUser(req, res, next){
        try {
            const {id} = req.params
            const result = await User.destroy({where : {id}})
            // res.status(200).json({
            //     message: 'Success',
            //     data: result
            // })
            return new SuccessResponse(res, 200, result, 'Success')
        } catch (error) {
            // res.json({
            //     message: 'Add User Failed',
            //     data: error
            // })
            next(error)
        }
    }
    
}

module.exports = {
    UserController
}
