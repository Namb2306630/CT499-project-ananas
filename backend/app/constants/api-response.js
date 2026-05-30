class ApiResponse {
  static success({
    res,
    data,
    message = "success",
    statusCode = 200,
    code = 200,
  }) {
    return res.status(statusCode).json({
      code,
      message,
      result: data,
    });
  }
}

module.exports = ApiResponse;
