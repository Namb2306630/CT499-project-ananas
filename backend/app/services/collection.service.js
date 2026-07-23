const Collection = require("../models/collection.model");
const ErrorCode = require("../constants/errors");
const Slugify = require("slugify");
const updateFields = require("../utils/updateFields.util");
const Product = require("../models/product.model");
const slugName = (name) => {
  return Slugify(name, {
    lower: true,
    locale: "vi",
    strict: true,
  });
};

class CollectionService {
  async getByIdThrow(id) {
    const collection = await Collection.findOne({ _id: id, isDeleted: false });

    if (!collection) throw ErrorCode.COLLECTION_NOT_EXISTS();
    return collection;
  }

  async create(payload) {
    const slug = slugName(payload.name);

    const existCollection = await Collection.findOne({ slug });
    // RESTORE
    if (existCollection) {
      if (existCollection.isDeleted) {
        existCollection.isDeleted = false;
        existCollection.isActive = true;

        existCollection.name = payload.name;
        if (payload.description) {
          existCollection.description = payload.description;
        }
        await existCollection.save();

        return {
          data: existCollection,
          action: "restored",
        };
      }
      throw ErrorCode.COLLECTION_ALREADY_EXISTS();
    }

    const collection = await Collection.create({
      ...payload,
      slug,
    });
    return {
      data: collection,
      action: "created",
    };
  }
  async update(id, payload) {
    const collection = await this.getByIdThrow(id);

    if (payload.name) {
      const slug = slugName(payload.name);
      const exist = await Collection.findOne({
        slug,
        _id: { $ne: id },
        isDeleted: false,
      });

      if (exist) {
        throw ErrorCode.COLLECTION_SLUG_ALREADY_EXISTS();
      }
      collection.name = payload.name;
      collection.slug = slug;
    }
    updateFields(collection, payload, ["description", "isActive"]);

    await collection.save();

    return collection;
  }
  async remove(id) {
    const collection = await this.getByIdThrow(id);

    const hasProduct = await Product.exists({
      productCollection: id,
      status: { $ne: "inactive" },
    });

    if (hasProduct) {
      throw ErrorCode.COLLECTION_HAS_PRODUCTS();
    }

    collection.isActive = false;
    collection.isDeleted = true;

    await collection.save();
  }
  async getAllForAdmin() {
    // const collections = await Collection.find({
    //   isDeleted: false,
    // }).sort({
    //   name: -1,
    // });

    // return collections;
    return await Collection.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "products",
          let: {
            collectionId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$productCollection", "$$collectionId"],
                },
                status: {
                  $ne: "discontinued",
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
        //thêm field mới vào doccument
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
          name: -1,
        },
      },
    ]);
  }
  async getAllForUser() {
    const collections = await Collection.find({
      isDeleted: false,
      isActive: true,
    }).sort({
      name: -1,
    });

    return collections;
  }
  async getBySlug(slug) {
    // const collection = this.getByIdThrow(id);

    // return collection;
    const [collection] = await Collection.aggregate([
      {
        $match: {
          slug: slug,
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "products",
          let: {
            collectionId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$productCollection", "$$collectionId"],
                },
                status: {
                  $ne: "discontinued",
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
    if (!collection) {
      throw ErrorCode.COLLECTION_NOT_EXISTS();
    }

    return collection;
  }
  async getProducts(collectionId) {
    // const all = await Product.find();

    // console.log(all);

    const products = await Product.find({
      productCollection: collectionId,
      status: { $ne: "inactive" },
    }).populate("variants");

    return products;
  }
  async getOptions() {
    return await Collection.find(
      {
        isDeleted: false,
        isActive: true,
      },
      {
        name: 1,
      },
    ).sort({ name: 1 });
  }
}

module.exports = new CollectionService();
