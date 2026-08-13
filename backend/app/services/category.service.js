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
      //Lấy parent của category hiện tại
      const itemParent = item.parent ? item.parent.toString() : null;
      //Lấy ID của parent mà hàm đang tìm
      const parentId = parent ? parent.toString() : null;

      return itemParent === parentId;
    })
    .map((item) => ({
      ...item,
      children: buildCategoryTree(categories, item._id),
    }));
};

const checkChild = async (parentId, categoryId) => {
  const child = await Category.find({
    parent: categoryId,
    isDeleted: false,
  });

  for (const item of child) {
    // parent mới chính là con của category hiện tại
    if (item._id.toString() === parentId.toString()) {
      return true;
    }

    if (await checkChild(parentId, item._id)) {
      return true;
    }
  }
  return false;
};
class CategoryService {
  async create(payload, file) {
    const { name, parent } = payload;
    const slug = slugName(name);

    // kiểm tra parent có tồn tại không
    if (parent) {
      const parentCategory = await Category.findOne({
        _id: parent,
        isDeleted: false,
      });

      if (!parentCategory) {
        throw ErrorCode.CATEGORY_NOT_EXISTS();
      }
    }

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

    if (parent && parent.toString() === categoryId.toString()) {
      throw ErrorCode.CATEGORY_INVALID_PARENT();
    }
    if (parent) {
      const isLoop = await checkChild(parent, categoryId);

      if (isLoop) {
        throw ErrorCode.CATEGORY_INVALID_PARENT();
      }
    }
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
    const category = await Category.findOne({
      _id: categoryId,
    });

    if (!category) {
      throw ErrorCode.CATEGORY_NOT_EXISTS();
    }

    const hasChild = await Category.exists({
      parent: categoryId,
      isDeleted: false,
    });

    if (hasChild) {
      throw ErrorCode.CATEGORY_HAS_CHILD();
    }

    category.isDeleted = true;
    category.isActive = false;

    await category.save();
  }

  async getAllForAdmin() {
    return await Category.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "parent",
          foreignField: "_id",
          as: "parent",
        },
      },
      {
        $unwind: {
          path: "$parent",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "products",
          let: {
            categoryId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $in: ["$$categoryId", "$categories"],
                    },
                    {
                      $ne: ["$status", "discontinued"],
                    },
                  ],
                },
              },
            },
            {
              $count: "count",
            },
          ],
          as: "productCount",
        },
      },
      {
        $addFields: {
          productCount: {
            $ifNull: [
              {
                $arrayElemAt: ["$productCount.count", 0],
              },
              0,
            ],
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);
  }

  async getAllForUser() {
    const categories = await Category.find({
      isDeleted: false,
      isActive: true,
    })
      .sort({ slug: -1 })
      .lean();

    return buildCategoryTree(categories);
  }

  async getBySlug(slug) {
    // const category = await Category.findOne({ slug: slug });
    // if (!category) throw ErrorCode.CATEGORY_NOT_EXISTS();

    // return category;
    const [category] = await Category.aggregate([
      {
        $match: {
          slug,
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "products",
          let: {
            categoryId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $in: ["$$categoryId", "$categories"],
                    },
                    {
                      $ne: ["$status", "discontinued"],
                    },
                  ],
                },
              },
            },
            {
              $count: "count",
            },
          ],
          as: "productCount",
        },
      },
      {
        $addFields: {
          productCount: {
            $ifNull: [
              {
                $arrayElemAt: ["$productCount.count", 0],
              },
              0,
            ],
          },
        },
      },
    ]);
    if (!category) throw ErrorCode.CATEGORY_NOT_EXISTS();

    return category;
  }
}

module.exports = new CategoryService();
