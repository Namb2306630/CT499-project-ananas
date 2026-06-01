const Brand = require("../models/brand.model");
const slugify = require("slugify");
const ErrorCode = require("../constants/errors");
const updateFields = require("../utils/updateFields.until");

class BrandService {
  async create(payload) {
    const { name } = payload;

    const slug = slugify(name, {
      lower: true,
      locale: "vi",
      strict: true,
    });

    const existBrand = await Brand.findOne({ slug });
    if (existBrand) {
      if (existBrand.isDeleted) {
        existBrand.isDeleted = false;
        existBrand.isActive = true;

        await existBrand.save();

        return existBrand;
      }
      throw ErrorCode.BRAND_ALREADY_EXISTS();
    }

    return Brand.create({
      ...payload,
      slug,
    });
  }

  async update(id, payload) {
    const brand = await Brand.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!brand) throw ErrorCode.BRAND_NOT_EXISTS();

    const { name, logo, description, isActive } = payload;
    if (name) {
      const slug = slugify(name, {
        lower: true,
        locale: "vi",
        strict: true,
      });

      const existBrand = await Brand.findOne({
        slug,
        _id: { $ne: categoryId },
        isDeleted: false,
      });

      if (existBrand) {
        throw ErrorCode.BRAND_NOT_EXISTS();
      }

      brand.name = name;
      brand.slug = slug;
    }

    updateFields(brand, payload, ["logo", "description", "isActive"]);

    await brand.save();

    return brand;
  }

  async delete(id) {
    const brand = await Brand.findOne({ _id: id });
    if (!brand) throw ErrorCode.BRAND_NOT_EXISTS();

    brand.isActive = false;
    brand.isDeleted = true;

    await brand.save();
  }

  async getAll() {
    return await Brand.find({ isDeleted: false, isActive: true }).sort({
      createdAt: -1,
    });
  }

  async getById(id) {
    const brand = await Brand.findOne({ _id: id });
    if (!brand) throw ErrorCode.BRAND_NOT_EXISTS();

    return brand;
  }
}

module.exports = new BrandService();
