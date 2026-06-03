const Category = require("../models/category.model");
const ErrorCode = require("../constants/errors");
const slugify = require("slugify");
const updateFields = require("../utils/updateFields.until");

const slugName = (name) =>
  slugify(name, {
    lower: true,
    locale: "vi",
    strict: true,
  });
class CategoryService {
  async create(payload) {
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

    return Category.create({
      ...payload,
      slug,
    });
  }

  async update(categoryId, payload) {
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

  async getAll() {
    return await Category.find({ isDeleted: false, isActive: true }).sort({
      createdAt: -1,
    });
  }

  async getById(categoryId) {
    const category = await Category.findOne({ _id: categoryId });
    if (!category) throw ErrorCode.CATEGORY_NOT_EXISTS();

    return category;
  }
}

module.exports = new CategoryService();
