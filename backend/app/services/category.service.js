const Category = require("../models/category.model");
const ErrorCode = require("../constants/errors");
const slugify = require("slugify");
const updateFields = require("../utils/updateFields.util");

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
      const itemParent = item.parent ? item.parent.toString() : null;
      const parentId = parent ? parent.toString() : null;

      return itemParent === parentId;
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

    // Cchưa tồn tại  create
    if (!existCategory) {
      const category = await Category.create({
        ...payload,
        slug,
        image: file?.path.replace(/\\/g, "/") || null,
      });

      return {
        data: category,
        action: "created",
      };
    }

    // tồn tại nhưng bị xoá mềm  restore + update
    if (existCategory.isDeleted) {
      existCategory.isDeleted = false;
      existCategory.isActive = true;

      existCategory.name = name;
      existCategory.image =
        file?.path.replace(/\\/g, "/") || existCategory.image;

      await existCategory.save();

      return {
        data: existCategory,
        action: "restored",
      };
    }

    // tồn tại active
    throw ErrorCode.CATEGORY_ALREADY_EXISTS();
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
      if (oldImage) {
        deleteImage(oldImage);
      }
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
    return await Category.find({
      isDeleted: false,
    })
      .populate("parent")
      .sort({
        createdAt: -1,
      });
  }

  async getAllForUser() {
    const categories = await Category.find({
      isDeleted: false,
      isActive: true,
    })
      .sort({ slug: -1 })
      .populate("parent")
      .lean();

    // return buildCategoryTree(categories);
    return categories;
  }

  async getById(categoryId) {
    const category = await Category.findOne({ _id: categoryId });
    if (!category) throw ErrorCode.CATEGORY_NOT_EXISTS();

    return category;
  }
}

module.exports = new CategoryService();
