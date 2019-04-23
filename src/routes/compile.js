module.exports = function (compiler) {
  return function handleCompile(req, res) {
    let body = null;
    try {
      body = JSON.parse(req.body);
    } catch(err) {
      return res.sendStatus(400);
    }
    let code = body.src;
    let data = body.data;
    if (!code || !data) {
      return res.sendStatus(400);
    }
    data.REFRESH = body.refresh; // Stowaway flag.
    compiler.compile(code, data, function (err, val) {
      if (err && err.length) {
        res.status(500).json({error: err});
        return;
      }
      res.status(200).json(val);
    });
  };
};
