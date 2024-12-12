const { User, Order, Cart, Item, sequelize, Role } = require('../models')
const Validator = require('fastest-validator')
const v = new Validator()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config({ path: '.env' })
const JWT_SECRET = process.env.JWT_SECRET
const SuccessResponse = require('../helpers/Success.helper')
const ErrorResponse = require('../helpers/error.helper')

class UserController {
    async getUser(req, res, next) {
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
                },
                {
                    model: Role
                }
                ]
            })
            return new SuccessResponse(res, 200, result, 'Success')
        } catch (error) {
            next(error)
        }
    }

    async getUserbyId(req, res, next) {
        try {
            const { id } = req.params
            const result = await User.findOne({
                where: { id },
                include: [{
                    model: Order
                },
                {
                    model: Cart,
                    include: {
                        model: Item
                    }
                },
                {
                    model: Role
                }
                ]
            })
            return new SuccessResponse(res, 200, result, 'Success')
        } catch (error) {
            next(error)
        }
    }

    async addUser(req, res, next) {
        try {
            const { fullName, email, password, address, phone, roleName } = req.body
            const checkUser = await User.findOne({ where: { email } })
            const schema = {
                email: { type: "email", optional: false },
                password: { type: "string", min: 5, max: 255, optional: false }
            }
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);


            if (checkUser) {
                // validate Email
                if (checkUser.dataValues.email == email) {
                    throw new ErrorResponse(401, {}, 'Email Already Exist')
                } else {
                    // Validate Data
                    const validationResult = v.validate({ email, password }, schema)

                    if (validationResult !== true) {
                        throw new ErrorResponse(401, validationResult, 'Validation Failed')
                    } else {
                        const role = await Role.create({ roleName })
                        const result = await User.create({ fullName, email, password: hash, address, phone, roleId: role.id })
                        return new SuccessResponse(res, 200, result, 'Success')
                    }
                }
            } else {
                // Validate Data
                const validationResult = v.validate({ email, password }, schema)

                if (validationResult !== true) {
                    throw new ErrorResponse(401, validationResult, 'Validation Failed')
                } else {
                    const role2 = await Role.create({ roleName })
                    const result2 = await User.create({ fullName, email, password: hash, address, phone, roleId: role2.id })
                    return new SuccessResponse(res, 201, result2, 'Success')
                }

            }

        } catch (error) {
            next(error)
        }
    }

    async loginUser(req, res, next) {
        try {
            const { email, password } = req.body
            const checkUser = await User.findOne({ where: { email } })

            if (!checkUser) {
                throw new ErrorResponse(401, {}, 'Email not Found')
            }

            const checkPassword = bcrypt.compareSync(password, checkUser.dataValues.password);

            if (!checkPassword) {
                throw new ErrorResponse(401, {}, 'Wrong Password')
            }

            const _token = jwt.sign({ email, id: checkUser.dataValues.id }, JWT_SECRET, { expiresIn: '24h' });

            return res.status(200).json({
                status: true,
                message: 'Login success',
                token: _token,
                data: checkUser
            })

        } catch (error) {
            // res.status(500).json({
            //     message: 'Login User Failed',
            //     data: error
            // })
            next(error)
        }
    }

    async updateUser(req, res, next) {
        try {
            const { id } = req.params
            const { fullName, email, password, address, phone } = req.body
            const checkUser = await User.findOne({ where: { id } })
            const schema = {
                email: { type: "email", optional: true },
                password: { type: "string", min: 5, max: 255, optional: true }
            }

            if (checkUser) {
                // Validate Email
                if (checkUser.dataValues.email == email) {
                    throw new ErrorResponse(401, {}, 'Email Already Exist')
                } else {
                    // Validate Data
                    const validationResult = v.validate({ email, password }, schema)

                    if (validationResult !== true) {
                        throw new ErrorResponse(401, validationResult, 'Validation Failed')
                    } else {
                        const result = await User.update({ fullName, email, password, address, phone }, {
                            where: {
                                id
                            }
                        })
                        return new SuccessResponse(res, 200, result, 'Success')
                    }
                }
            } else {
                // Validate Data
                const validationResult = v.validate({ email, password }, schema)

                if (validationResult !== true) {
                    throw new ErrorResponse(401, validationResult, 'Validation Failed')
                } else {
                    const result2 = await User.update({ fullName, email, password, address, phone }, {
                        where: {
                            id
                        }
                    })
                    return new SuccessResponse(res, 200, result2, 'Success')
                }
            }


        } catch (error) {
            next(error)
        }
    }

    async deleteUser(req, res, next) {
        try {
            const { id } = req.params
            const result = await User.destroy({ where: { id } })
            return new SuccessResponse(res, 200, result, 'Success')
        } catch (error) {
            next(error)
        }
    }

}

module.exports = {
    UserController
}
