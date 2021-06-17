const jwt = require("jsonwebtoken");

const getJWT = async (id, email) => {
  try {
    return jwt.sign(
      {
        email,
        id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: Number(process.env.JWT_EXPIRE_TIME),
      }
    );
  } catch (e) {
    throw new Error(e.message);
  }
};

const authorize = (req, res, next) => {
  // middleware to check if user is logged in
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: "Authentication failed." });
  }
};

module.exports = {
  getJWT,
  authorize,
};
