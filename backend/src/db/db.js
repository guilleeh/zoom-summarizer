const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// CREATE
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

const createRecording = async (name, s3Key, transcriptId, email) => {
  const result = await prisma.recording.create({
    data: {
      name,
      s3Key,
      transcriptId,
      user: {
        connect: {
          email,
        },
      },
    },
  });

  return result;
};

// READ
const getSingleUserByEmail = async (email) => {
  const user = await prisma.user.findFirst({
    where: { email },
  });

  return user;
};

const getSingleUserById = async (id) => {
  const user = await prisma.user.findFirst({
    where: { id },
  });

  return user;
};

const getAllRecordings = async (id) => {
  const recordings = await prisma.recording.findMany({
    where: { userId: id },
  });

  return recordings;
};

const getSingleRecording = async (transcriptId) => {
  const recording = await prisma.recording.findFirst({
    where: {
      transcriptId,
    },
  });

  return recording;
};

module.exports = {
  createUser,
  createRecording,
  getSingleUserByEmail,
  getSingleUserById,
  getAllRecordings,
  getSingleRecording,
};
