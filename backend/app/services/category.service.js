const Category = require("../models/category.model");
const ErrorCode = require("../constants/errors");
const slugify = require("slugify");

class CategoryService {
  async create(payload) {
    const { name } = payload;

    const existCategory = await Category.findOne({ name });
    if (existCategory) throw ErrorCode.CATEGORY_ALREADY_EXISTS();

    const slug = slugify(name, {
      lower: true,
      locale: "vi",
      strict: true,
    });

    return Category.create({
      ...payload,
    });
  }

  async update(categoryId, payload) {
    const { name, slug, image, parent, isActive } = payload;
    const category = await Category.findOne({ _id: categoryId });
    if (!category) throw ErrorCode.CATEGORY_NOT_EXISTS();

    if (payload.name != null) {
      const existCategory = await Category.findOne({
        name: payload.name,
        _id: { $ne: categoryId },
      });
    }

    Object.assign(category, {
      name,
      slug,
      image,
      parent,
      isActive,
    });

    await category.save();

    return category;
  }

  async remove(categoryId) {
    const category = await Category.findOne({ _id: categoryId });
    if (!category) throw ErrorCode.CATEGORY_NOT_EXISTS();

    category.isDeleted = true;
    await category.save();
  }

  async getAll() {
    return await Category.find({ isDeleted: false }).sort({ createdAt: -1 });
  }

  async getById(categoryId) {
    const category = await Category.findOne({ _id: categoryId });
    if (!category) throw ErrorCode.CATEGORY_NOT_EXISTS();

    return category;
  }
}

module.exports = new CategoryService();
