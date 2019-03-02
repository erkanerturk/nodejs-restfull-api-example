const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token =
    req.headers["x-access-token"] || req.body.token || req.query.token;

  if (!token) {
    return res.json({
      status: false,
      message: "No token provided"
    });
  }

  jwt.verify(token, req.app.get("api_secret_key"), (err, decoded) => {
    if (err) {
      return res.json({
        status: false,
        message: "Failed to authenticate token"
      });
    }

    req.decode = decoded;
    next();
  });
};
