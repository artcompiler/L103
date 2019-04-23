module.exports = function (compiler) {
  return function handleVersion(req, res) {
    res.send(compiler.version || "v0.0.0");
  };
};
