const { Item, User, Category, ImageItem } = require("../models");
const SuccessResponse = require("../helpers/Success.helper");
const imageitem = require("../models/imageitem");

class ItemController {
  async getItem(req, res, next) {
    try {
      const result = await Item.findAll({
        include: [
          {
            model: User,
            attributes: ["id", "fullName", "email", "phone"],
          },
          {
            model: Category,
          },
          {
            model: ImageItem,
          }
        ],
      });
      return new SuccessResponse(res, 200, result, "Success");
    } catch (error) {
      next(error);
    }
  }

  async getItembyId(req, res, next) {
    try {
      const { id } = req.params;
      const result = await Item.findOne({
        where: { id },
        include: [
          {
            model: User,
            attributes: ["id", "fullName", "email", "phone"],
          },
          {
            model: Category,
          },
          {
            model: ImageItem,
          }
        ],
      });
      return new SuccessResponse(res, 200, result, "Success");
    } catch (error) {
      next(error);
    }
  }

  async addItem(req, res, next) {
    try {
      const { userId } = req.params;
      const { productName, price, categoryName, size, color } = req.body;
      console.log("FILES =>", req.files);
      const category = await Category.create({ categoryName });
      const result = await Item.create({
        userId,
        productName,
        price,
        categoryId: category.id,
        size,
        color,
      });
      await Promise.all(
        req.files.map((file) =>
          ImageItem.create({
            cloudinaryId: file.filename,
            url: file.path,
            itemId: result.id,
          })
        )
      );
      return new SuccessResponse(res, 201, result, "Success");
    } catch (error) {
      next(error);
    }
  }

  async updateItem(req, res, next) {
    try {
      const { id } = req.params;
      const { productName, price } = req.body;
      const result = await Item.update(
        { productName, price },
        {
          where: {
            id,
          },
        }
      );
      return new SuccessResponse(res, 200, result, "Success");
    } catch (error) {
      next(error);
    }
  }

  async deleteItem(req, res, next) {
    try {
      const { id } = req.params;
      const result = await Item.destroy({ where: { id } });
      return new SuccessResponse(res, 200, result, "Success");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  ItemController,
};
