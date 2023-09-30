const jwt = require("jsonwebtoken");

var jwtSecret = "mysecrettoken";

module.exports = function (req, res, next) {
  // Get token from the Authorization header
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

  // Check if there is no token in the header
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify the token
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user; // Set the user information in the request object
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
