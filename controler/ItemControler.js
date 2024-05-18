const { Item, User } = require('../models')
const SuccessResponse = require('../helpers/Success.helper')

class ItemController {
    async getItem(req, res, next) {
        try {
            const result = await Item.findAll({
                include: {
                    model: User,
                    attributes: ["id", "fullName", "email", "phone"]
                }
            })
            // res.status(200).json({
            //     message: 'Success',
            //     data: result
            // })
            return new SuccessResponse(res, 200, result, 'Success')
        } catch (error) {
            // res.json({
            //     message: 'Product Data Failed',
            //     data: error
            // })
            next(error)
        }
    }
    
    async getItembyId(req, res, next) {
        try {
            const {id} = req.params
            const result = await Item.findOne({where: {id},
                include: {
                    model: User,
                    attributes: ["id", "fullName", "email", "phone"]
                }
            })
            // res.status(200).json({
            //     message: 'Success',
            //     data: result
            // })
            return new SuccessResponse(res, 200, result, 'Success')
        } catch (error) {
            // res.json({
            //     message: 'Product Data Failed',
            //     data: error
            // })
            next(error)
        }
    }
    
    async addItem(req, res, next) {
        try {
            const {userId} = req.params
            const {productName, price} = req.body
            const result = await Item.create({userId, productName, price})
            // res.status(201).json({
            //     message: 'Success',
            //     data: result
            // })
            return new SuccessResponse(res, 201, result, 'Success')
        } catch (error) {
            // res.json({
            //     message: 'Product User Failed',
            //     data: error
            // })
            next(error)
        }
    }
    
    async updateItem(req, res, next) {
        try {
            const {id} = req.params
            const {productName, price} = req.body
            const result = await Item.update({productName, price},{
                where : {
                    id
                }
            })
            // res.status(200).json({
            //     message: 'Success',
            //     data: result
            // })
            return new SuccessResponse(res, 200, result, 'Success')
        } catch (error) {
            // res.json({
            //     message: 'Product User Failed',
            //     data: error
            // })
            next(error)
        }
    }
    
    async deleteItem(req, res, next) {
        try {
            const {id} = req.params
            const result = await Item.destroy({where : {id}})
            // res.status(200).json({
            //     message: 'Success',
            //     data: result
            // })
            return new SuccessResponse(res, 200, result, 'Success')
        } catch (error) {
            // res.json({
            //     message: 'Product User Failed',
            //     data: error
            // })
            next(error)
        }
    }
    
}

module.exports = {
    ItemController
}
