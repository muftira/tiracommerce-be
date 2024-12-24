const { Item, User, Category, ImageItem } = require("../models");
const SuccessResponse = require("../helpers/Success.helper");
const cloudinary = require('cloudinary').v2;

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
          },
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
          },
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
      const { itemId } = req.params;
      const { categoryId } = req.query
      const { productName, price, categoryName, size, color, deletedStatus } = req.body;
      const category = await Category.update(
        { categoryName },
        {
          where: {
            id: categoryId,
          },
        }
      );
      const result = await Item.update(
        { productName, price, categoryId: category.id, size, color },
        {
          where: {
            id: itemId,
          },
        }
      );

      if (deletedStatus) {
        const validData = deletedStatus.replace(/([{,]\s*)(\w+):/g, '$1"$2":')
        const parseDeletedStatus = JSON.parse(validData);
        const imageStatus = await Promise.all(parseDeletedStatus.map((data, index) => ImageItem.update({ statusDeleted: data.status }, { where: { id: data.id } })))
        const imageDeleted = await ImageItem.destroy({ where: { statusDeleted: true } })
        const cloudinaryDeleted = await Promise.all(parseDeletedStatus.map(data => cloudinary.uploader.destroy(data.cloudinaryId)))
      }

      if (req.files.length > 0) {
        const imageUpdate = await Promise.all(req.files.map(file => ImageItem.create({ cloudinaryId: file.filename, url: file.path, itemId })))
      }

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
