const Style = require("../models/style.model");
const ErrorCode = require("../constants/errors");
const updateFields = require("../utils/updateFields.until.js");
const slugify = require("slugify");
const slugName = (name) =>
  slugify(name, {
    lower: true,
    locale: "vi",
    strict: true,
  });

class StyleService {
  async getByIdOrThrow(id) {
    const style = await Style.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!style) {
      throw ErrorCode.STYLE_NOT_EXISTS();
    }

    return style;
  }

  async create(payload) {
    const { name } = payload;
    const slug = slugName(name);
    const style = await Style.findOne({ slug });

    if (style) {
      if (style.isDeleted) {
        style.isActive = true;
        style.isDeleted = false;

        await style.save();

        return style;
      }
      throw ErrorCode.STYLE_ALREADY_EXISTS();
    }
    return Style.create({
      ...payload,
      slug,
    });
  }
  async update(id, payload) {
    const style = await this.getByIdOrThrow(id);
    const { name } = payload;
    if (name) {
      const slug = slugName(name);

      const eixisStyle = await Style.findOne({
        slug,
        _id: { $ne: id },
        isDeleted: false,
      });

      if (eixisStyle) throw ErrorCode.STYLE_ALREADY_EXISTS();

      style.name = name;
      style.slug = slug;
    }
    updateFields(style, payload, ["description", "isActive"]);
    await style.save();
    return style;
  }
  async remove(id) {
    const style = await this.getByIdOrThrow(id);

    style.isActive = false;
    style.isDeleted = true;

    await style.save();
  }

  async getAllForUser() {
    return await Style.find({
      isDeleted: false,
      isActive: true,
    }).sort({ createdAt: -1 });
  }

  async getAllForAdmin() {
    return await Style.find({
      isDeleted: false,
    }).sort({ createdAt: -1 });
  }

  async getById(id) {
    const style = await this.getByIdOrThrow(id);

    return style;
  }
}

module.exports = new StyleService();
