const {Cart, Cart_item, Item, User, sequelize} = require('../models')
const { Op, fn } = require("sequelize");
const SuccessResponse = require('../helpers/Success.helper')

class CartController {
    async getCart(req, res, next){
        try {
            const result = await Cart.findAll({
                where: {statusCart: false},
                include: [{
                    model: User
                },
                {
                    model: Cart_item,
                    as: "ItemsProduct",
                    attributes: ["id", "itemId", "cartId", "quantity", "createdAt", "updatedAt"],
                    include: Item
                    
                }]
            })

            return new SuccessResponse(res, 200, result, 'Success')
    
            // res.status(200).json({
            //     message: 'Success',
            //     data: result
            // })
    
        } catch (error) {
            // res.json({
            //     message: 'Cart Data Failed',
            //     data: error
            // })
            next(error)
        }
    }
    
    async getCartbyId(req, res, next){
        try {
            const {id} = req.params
            const result = await Cart.findOne({
                where: {[Op.and]: [{id}, {statusCart: false}]
                }
                })
            // res.status(200).json({
            //     message: 'Success',
            //     data: result
            // })
            return new SuccessResponse(res, 200, result, 'Success')
        } catch (error) {
            // res.json({
            //     message: 'Cart Data Failed',
            //     data: error
            // })
            next(error)
        }
    }
    
    async getCart_item(req, res, next){
        try {
            const result = await Cart_item.findAll({
                attributes: ['id', 'itemId', "quantity", 'cartId', "createdAt", "updatedAt"],
                include: [
                    {
                        model: Item
                    },
                    {
                        model: Cart
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
            //     message: 'Cart Data Failed',
            //     data: error
            // })
            next(error)
        }
    }
    
    async getCart_itembyId(req, res, next){
        try {
            const {id} = req.params
            const result = await Cart_item.findOne({where: {id}, 
                attributes: ['id', 'itemId', 'cartId', "quantity", "createdAt", "updatedAt"],
                include: [
                {
                    model: Item
                },
                {
                    model: Cart
                }
            ]})
            // res.status(200).json({
            //     message: 'Success',
            //     data: result
            // })
            return new SuccessResponse(res, 200, result, 'Success')
        } catch (error) {
            // res.json({
            //     message: 'Cart Data Failed',
            //     data: error
            // })
            next(error)
        }
    }
    
    // buat cart baru atau untuk pertama kali
    async addCart(req, res, next){
        try {
            const {itemId, userId} = req.params
            const {quantity} = req.body
            const result1 = await Cart.create({userId})
            const result2 = await Cart_item.create({userId, itemId, cartId:result1.id, quantity})
            // res.status(201).json({
            //     message: 'Success',
            //     data: result1
            // })
            return new SuccessResponse(res, 201, result1, 'Success')
        } catch (error) {
            // res.json({
            //     message: 'Cart Data Failed',
            //     data: error
            // })
            next(error)
        }
    }
    
    
    // buat cart dengan cartId sama atau keduakali dan seterusnya
    async addCartbyId(req, res, next){
        try {

            const {cartId, itemId} = req.params
            const _item = await Cart_item.findAll({where: {[Op.and] : [{itemId}, {cartId}]}})
    
            if ( _item.length > 0) {
                await Cart_item.update({quantity: _item[0].dataValues.quantity + 1}, {where: {[Op.and] : [{itemId}, {cartId}]}})
            } else {
                 await Cart_item.create({itemId, cartId})
            }
    
            const result = await Cart_item.findOne({where: {[Op.and] : [{itemId}, {cartId}]}})
    
            // res.status(201).json({
            //     message: 'Success',
            //     data: result
            // })
            return new SuccessResponse(res, 201, result, 'Success')
        } catch (error) {
            // res.json({
            //     message: 'Cart Data Failed',
            //     data: error
            // })
            next(error)
        }
    }
    
    // update cart untuk input quantityTotal dan totalPrice property di cart tabel dari sisi frontend
    async updateCartbyItem(req, res, next){
        try {
            const {id} = req.params
            const {quantityTotal, totalPrice} = req.body
            const result = await Cart.update({quantityTotal, totalPrice}, {where: {id}})

            // const cartItem = await Cart_item.findAll()

            // let totalPrice = 0
            
            // for(let i = 0; i < cartItem.length; i ++) {
            //     const _cartItem = await Cart_item.findOne({where: {id: cartItem[i].dataValues.id}})
            //     totalPrice += _cartItem.dataValues.price * _cartItem.dataValues.quantity
            // }
            
            // const _carts = await Cart.update({totalPrice: totalPrice}, {where: id})

            // res.status(200).json({
            //     message: 'Success',
            //     data: result
            // })
            return new SuccessResponse(res, 200, result, 'Success')
        } catch (error) {
            // res.json({
            //     message: 'Cart Data Failed',
            //     data: error
            // })
            next(error)
        }
    }
    
    
    // delete satu item di cart dan property quantity 
    async deleteCartbyItem(req, res, next){
        try {
            const {cartId, itemId} = req.params
            const _item = await Cart_item.findOne({where: {[Op.and] : [{itemId}, {cartId}]}})
    
            if ( _item.dataValues.quantity > 1) {
                await Cart_item.update({quantity: _item.dataValues.quantity - 1}, {where: {[Op.and] : [{itemId}, {cartId}]}})
            } else if (_item.dataValues.quantity == 1) {
                await Cart_item.destroy({where: {[Op.and] : [{itemId}, {cartId}]}})
            }
    
            const result = await Cart_item.findOne({
                where: {[Op.and] : [{itemId}, {cartId}]}
            })
            
            // res.status(200).json({
            //     message: 'Success',
            //     data: result
            // })
            return new SuccessResponse(res, 200, result, 'Success')
        } catch (error) {
            // res.json({
            //     message: 'Cart Data Failed',
            //     data: error
            // })
            next(error)
        }
    }
    
    // delete cart atau semua item di cart
    async deleteCartAllItem(req, res, next) {
        try {
            const {id} = req.params
            const result = await Cart.destroy({where : {id}})
            // res.status(200).json({
            //     message: 'Success',
            //     data: result
            // })
            return new SuccessResponse(res, 200, result, 'Success')
        } catch (error) {
            // res.json({
            //     message: 'Cart Data Failed',
            //     data: error
            // })
            next(error)
        }
    }
}

module.exports = {
    CartController
}
