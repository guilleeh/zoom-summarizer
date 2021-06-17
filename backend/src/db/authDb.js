const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createUser = async (email, password, name) => {
  const result = await prisma.user.create({
    data: {
      email,
      password,
      name,
    },
  });
  return result;
};

module.exports = {
  createUser,
};
