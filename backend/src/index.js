const db = require("./db/authDb");
const bcrypt = require("bcrypt");
const jwtService = require("jsonwebtoken");
const express = require("express");
const app = express();

app.use(express.json());

app.get(`/`, async (req, res) => {
  res.json({ success: true, data: "Hello World!" });
});

app.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({
      success: false,
      error: "Email, password and name are required.",
    });
    return;
  }

  try {
    // hash password
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    const passwordHash = await bcrypt.hash(password, salt);

    // create user
    const response = await db.createUser(email, passwordHash, name);
    res.json({ success: true, data: response });
  } catch (e) {
    console.log(e);
    res.status(409).json({
      success: false,
      error: "Email account already registered.",
    });
  }
});

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () =>
  console.log(`
🚀 Server ready at: ${PORT}`)
);
