const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  console.log(req.headers, "Request dot headers");

  //get the token from the header if present
  const token = req.headers["x-access-token"] || req.headers["authorization"];

  console.log(token, "Token");
  //if no token found, return response (without going to the next middelware)
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    //if can verify the token, set req.user and pass to next middleware
    const decoded = jwt.verify(token, "myprivatekey");
    req.userData = { userId: decoded.userId };
    // req.user = decoded;
    next();
  } catch (ex) {
    //if invalid token
    res.status(400).send("Invalid token.");
  }
};
