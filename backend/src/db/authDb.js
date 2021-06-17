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

const getSingleUserByEmail = async (email) => {
  const user = await prisma.user.findFirst({
    where: { email },
  });

  return user;
};

module.exports = {
  createUser,
  getSingleUserByEmail,
};
