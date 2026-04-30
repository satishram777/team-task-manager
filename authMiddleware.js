const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async function (req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    // Populate full user with role
    const user = await User.findById(decoded.id).select('name email role');
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

