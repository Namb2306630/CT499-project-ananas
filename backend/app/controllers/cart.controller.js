const service = require("../services/cart.service");
const ApiResponse = require("../constants/api-response");

exports.create = async (req, res, next) => {
  try {
    const idUser = req.user._id;
    const data = await service.create(idUser, req.body);

    return ApiResponse.success({
      res,
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const idUser = req.user._id;
    const data = await service.update(idUser, id, req.body);

    return ApiResponse.success({
      res,
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.removeId = async (req, res, next) => {
  try {
    const idUser = req.user._id;
    await service.removeId(idUser, req.params.id);

    return ApiResponse.success({
      res,
      data: true,
    });
  } catch (err) {
    next(err);
  }
};

exports.removeAll = async (req, res, next) => {
  try {
    const idUser = req.user._id;
    await service.removeAll(idUser);

    return ApiResponse.success({
      res,
      data: true,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const idUser = req.user._id;
    const data = await service.getAll(idUser);

    if (data.lenght === 0) {
      return ApiResponse.success({
        res,
        data: [],
        message: "Không có sản phẩm nào trong giỏ hàng!",
      });
    }

    return ApiResponse.success({
      res,
      data,
    });
  } catch (err) {
    next(err);
  }
};
