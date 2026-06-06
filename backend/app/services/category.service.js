const Category = require("../models/category.model");
const ErrorCode = require("../constants/errors");
const slugify = require("slugify");
const updateFields = require("../utils/updateFields.until");

const { deleteImage } = require("../utils/uploadImage.util");

const slugName = (name) =>
  slugify(name, {
    lower: true,
    locale: "vi",
    strict: true,
  });

const buildCategoryTree = (categories, parent = null) => {
  return categories
    .filter((item) => {
      if (parent === null) {
        return item.parent === null;
      }
      return item.parent?.toString() === parent.toString();
    })
    .map((item) => ({
      ...item,
      children: buildCategoryTree(categories, item._id),
    }));
};
class CategoryService {
  async create(payload, file) {
    const { name } = payload;

    const slug = slugName(name);

    const existCategory = await Category.findOne({ slug });

    if (existCategory) {
      if (existCategory.isDeleted) {
        existCategory.isDeleted = false;
        existCategory.isActive = true;

        await existCategory.save();

        return existCategory;
      }
      throw ErrorCode.CATEGORY_ALREADY_EXISTS();
    }

    payload.image = file?.path.replace(/\\/g, "/") || null;

    return Category.create({
      ...payload,
      slug,
    });
  }

  async update(categoryId, payload, file) {
    const category = await Category.findOne({
      _id: categoryId,
      isDeleted: false,
    });

    if (!category) throw ErrorCode.CATEGORY_NOT_EXISTS();

    const { name, image, parent, isActive } = payload;
    if (name) {
      const slug = slugName(name);

      const existCategory = await Category.findOne({
        slug,
        _id: { $ne: categoryId },
        isDeleted: false,
      });

      if (existCategory) {
        throw ErrorCode.CATEGORY_ALREADY_EXISTS();
      }

      category.name = name;
      category.slug = slug;
    }

    if (file) {
      const oldImage = category.image;

      category.image = file.path.replace(/\\/g, "/");

      await category.save();

      if (oldImage) {
        deleteImage(oldImage);
      }

      return category;
    }

    updateFields(category, payload, ["image", "parent", "isActive"]);

    await category.save();

    return category;
  }

  async remove(categoryId) {
    const category = await Category.findOne({ _id: categoryId });
    if (!category) throw ErrorCode.CATEGORY_NOT_EXISTS();

    category.isDeleted = true;
    category.isActive = false;
    await category.save();
  }

  async getAllForAdmin() {
    return await Category.find({ isDeleted: false }).sort({
      createdAt: -1,
    });
  }

  async getAllForUser() {
    const categories = await Category.find({
      isDeleted: false,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    return buildCategoryTree(categories);
  }

  async getById(categoryId) {
    const category = await Category.findOne({ _id: categoryId });
    if (!category) throw ErrorCode.CATEGORY_NOT_EXISTS();

    return category;
  }
}

module.exports = new CategoryService();
