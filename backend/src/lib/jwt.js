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

module.exports = {
  getJWT,
};
