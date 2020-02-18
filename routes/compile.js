module.exports = (compiler) => {
  return (req, res) => {
    let body = req.body;
    let code = body.code;
    let data = body.data;
    let config = body.config || {};
    if (!code || !data) {
      return res.sendStatus(400);
    }
    compiler.compile(code, data, config, function (err, val) {
      if (err && err.length) {
        res.status(err[0].statusCode || 500).json({error: err});
        return;
      }
      res.status(200).json(val);
    });
  };
};
