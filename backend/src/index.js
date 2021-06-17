const db = require("./db/authDb");
const jwtLib = require("./lib/jwt");
const awsLib = require("./lib/aws");
const bcrypt = require("bcrypt");
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());

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
    delete response.password;
    res.json({ success: true, data: response });
  } catch (e) {
    console.log(e);
    res.status(409).json({
      success: false,
      error: "Email account already registered.",
    });
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res
      .status(400)
      .json({ success: false, error: "Email and password are required." });
    next();
    return;
  }

  try {
    // Find user record
    const user = await db.getSingleUserByEmail(email);
    if (!user) {
      res.status(401).json({ success: false, error: "Authentication failed." });
      return;
    }

    // securely compare passwords
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ success: false, error: "Authentication failed." });
      return;
    }

    // get jwt
    const jwtToken = await jwtLib.getJWT(user.id, user.email);

    // send jwt and user id to store in local storage
    res
      .status(200)
      .json({ success: true, data: { jwt: jwtToken, id: user.id } });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      error: `Authentication failed.`,
    });
  }
});

// PROTECTED ROUTES

app.post("/upload", jwtLib.authorize, async (req, res) => {
  console.log(req.files);
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const file = req.files.uploadedFile;
  // upload to s3
  const filePath = await awsLib.uploadFile(file);
  // call aai api

  res.status(200).json({ success: true, data: filePath });
});

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () =>
  console.log(`
🚀 Server ready at: ${PORT}`)
);
