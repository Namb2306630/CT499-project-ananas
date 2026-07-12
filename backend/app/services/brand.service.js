const Brand = require("../models/brand.model");
const slugify = require("slugify");
const ErrorCode = require("../constants/errors");
const updateFields = require("../utils/updateFields.util");
const { deleteImage } = require("../utils/uploadImage.util");
const ProductLine = require("../models/product-line.model");
const mongoose = require("mongoose");
const slugName = (name) =>
  slugify(name, {
    lower: true,
    locale: "vi",
    strict: true,
  });

class BrandService {
  async create(payload, file) {
    if (!file) {
      throw ErrorCode.LOGO_BRAND_REQUIRED();
    }

    const { name } = payload;
    const slug = slugName(name);

    const existBrand = await Brand.findOne({ slug });

    // RESTORE
    if (existBrand) {
      if (existBrand.isDeleted) {
        existBrand.isDeleted = false;
        existBrand.isActive = true;

        existBrand.name = name;
        existBrand.logo = file.path.replace(/\\/g, "/");

        await existBrand.save();

        return {
          data: existBrand,
          action: "restored",
        };
      }

      throw ErrorCode.BRAND_ALREADY_EXISTS();
    }

    // CREATE
    const brand = await Brand.create({
      ...payload,
      logo: file.path.replace(/\\/g, "/"),
      slug,
    });

    return {
      data: brand,
      action: "created",
    };
  }

  async update(id, payload, file) {
    const brand = await Brand.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!brand) throw ErrorCode.BRAND_NOT_EXISTS();

    const { name, logo, description, isActive } = payload;
    if (name) {
      const slug = slugName(name);

      const existBrand = await Brand.findOne({
        slug,
        _id: { $ne: id },
        isDeleted: false,
      });

      if (existBrand) {
        throw ErrorCode.BRAND_ALREADY_EXISTS();
      }

      brand.name = name;
      brand.slug = slug;
    }
    if (file) {
      const oldLogo = brand.logo;

      brand.logo = file.path.replace(/\\/g, "/");

      await brand.save();

      if (oldLogo) {
        deleteImage(oldLogo);
      }

      return brand;
    }

    updateFields(brand, payload, ["logo", "description", "isActive"]);

    await brand.save();

    return brand;
  }

  async delete(id) {
    const brand = await Brand.findOne({ _id: id });

    if (!brand) throw ErrorCode.BRAND_NOT_EXISTS();
    const productLines = await ProductLine.find({
      brand: id,
      isDeleted: false,
    });

    if (productLines.length > 0) {
      throw ErrorCode.BRAND_EXIST_PRODUCT();
    }
    brand.isActive = false;
    brand.isDeleted = true;

    await brand.save();
  }

  async getAllForAdmin() {
    // return await Brand.find({ isDeleted: false }).sort({
    //   createdAt: -1,
    // });
    return Brand.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "productlines",
          let: { brandId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$brand", "$$brandId"],
                },
                isDeleted: false,
                // isActive: true,
              },
            },
          ],
          as: "productLines",
        },
      },
      {
        $addFields: {
          productLines: {
            $size: "$productLines",
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
    // return await Brand.find({ isDeleted: false, isActive: true }).sort({
    //   createdAt: -1,
    // });
    return Brand.aggregate([
      {
        $match: {
          isDeleted: false,
          isActive: true,
        },
      },
      {
        $lookup: {
          from: "productlines",
          localField: "_id",
          foreignField: "brand",
          pipeline: [
            {
              $match: {
                isDeleted: false,
                isActive: true,
              },
            },
          ],
          as: "productLines",
        },
      },
    ]);
  }

  async getBySlug(slug) {
    // const brand = await Brand.findById(id);
    // if (!brand) throw ErrorCode.BRAND_NOT_EXISTS();

    // return brand;

    const [brand] = await Brand.aggregate([
      {
        $match: {
          slug: slug,
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "productlines",
          localField: "_id",
          foreignField: "brand",
          pipeline: [
            {
              $match: {
                isDeleted: false,
              },
            },
          ],
          as: "productLines",
        },
      },
      {
        $addFields: {
          productLineCount: {
            $size: "$productLines",
          },
        },
      },
    ]);

    if (!brand) throw ErrorCode.BRAND_NOT_EXISTS();

    return brand;
  }

  async getByBrand(id) {
    const brand = await Brand.findOne({
      _id: id,
      isDeleted: false,
      isActive: true,
    });

    const productLines = await ProductLine.find({
      brand: id,
      isDeleted: false,
      isActive: true,
    }).select("name slug");

    if (!brand) throw ErrorCode.BRAND_NOT_EXISTS();

    return productLines;
  }
}

module.exports = new BrandService();
