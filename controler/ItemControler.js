const { Item, User, Category } = require('../models')
const SuccessResponse = require('../helpers/Success.helper')

class ItemController {
    async getItem(req, res, next) {
        try {
            const result = await Item.findAll({
                include: [{
                    model: User,
                    attributes: ["id", "fullName", "email", "phone"]
                },
                {
                    model: Category
                }]
            })
            return new SuccessResponse(res, 200, result, 'Success')
        } catch (error) {
            next(error)
        }
    }

    async getItembyId(req, res, next) {
        try {
            const { id } = req.params
            const result = await Item.findOne({
                where: { id },
                include: [{
                    model: User,
                    attributes: ["id", "fullName", "email", "phone"]
                },
                {
                    model: Category
                }
                ]
            })
            return new SuccessResponse(res, 200, result, 'Success')
        } catch (error) {
            next(error)
        }
    }

    async addItem(req, res, next) {
        try {
            const { userId } = req.params
            const { productName, price, categoryName } = req.body
            const category = await Category.create({ categoryName })
            const result = await Item.create({ userId, productName, price, categoryId: category.id })
            return new SuccessResponse(res, 201, result, 'Success')
        } catch (error) {
            next(error)
        }
    }

    async updateItem(req, res, next) {
        try {
            const { id } = req.params
            const { productName, price } = req.body
            const result = await Item.update({ productName, price }, {
                where: {
                    id
                }
            })
            return new SuccessResponse(res, 200, result, 'Success')
        } catch (error) {
            next(error)
        }
    }

    async deleteItem(req, res, next) {
        try {
            const { id } = req.params
            const result = await Item.destroy({ where: { id } })
            return new SuccessResponse(res, 200, result, 'Success')
        } catch (error) {
            next(error)
        }
    }

}

module.exports = {
    ItemController
}
