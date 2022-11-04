function responseApi(res, code, message, data = []) {
  return res.status(code).json({
    message: message,
    data: data,
  });
}

module.exports = { responseApi };
