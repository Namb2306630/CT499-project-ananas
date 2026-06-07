const Collection = require("../models/collection.model");
const ErrorCode = require("../constants/errors");
const Slugify = require("slugify");
const updateFields = require("../utils/updateFields.until");
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

    if (!collection) throw ErrorCode.CATEGORY_NOT_EXISTS();
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

    collection.isActive = false;
    collection.isDeleted = true;

    await collection.save();
  }
  async getAllForAdmin() {
    const collections = await Collection.find({
      isDeleted: false,
    }).sort({
      name: -1,
    });

    return collections;
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
  async getById(id) {
    const collection = this.getByIdThrow(id);

    return collection;
  }
  async getProducts(collectionId) {
    const all = await Product.find();

    console.log(all);

    const products = await Product.find({
      collection: collectionId,
      status: { $ne: "discontinued" },
    }).populate("variants");

    return products;
  }
}

module.exports = new CollectionService();
