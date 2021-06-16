const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.get(`/`, async (req, res) => {
  res.json({ success: true, data: "Hello World!" });
});

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () =>
  console.log(`
🚀 Server ready at: ${PORT}`)
);
