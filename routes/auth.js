module.exports = (auth, scope) => {
  return (req, res, next) => {
    let body = null;
    try {
      body = JSON.parse(req.body);
    } catch(err) {
      return res.sendStatus(400);
    }
    const token = body.auth;
    auth(token, scope, (err, data) => {
      if (err) {
        return res.sendStatus(401);
      }
      if (data.access.indexOf(scope) === -1) {
        return res.status(401).send(`not authorized for ${scope}`);
      }
      next();
    });
  };
};
