const db = require("./db/db");
const jwtLib = require("./lib/jwt");
const awsLib = require("./lib/aws");
const pdfLib = require("./lib/pdf");
const fetch = require("node-fetch");
const bcrypt = require("bcrypt");
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const { response } = require("express");
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

app.get("/me", jwtLib.authorize, async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, error: "You must provide the user id." });
  }

  try {
    const user = await db.getSingleUserById(Number(id));
    delete user.password;

    return res.status(200).json({ success: true, data: user });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      error: "There was an error retrieving your record.",
    });
  }
});

app.post("/upload", jwtLib.authorize, async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, error: "You must provide the user id." });
  }

  if (!req.files || Object.keys(req.files).length === 0) {
    return res
      .status(400)
      .json({ success: false, error: "No files were uploaded." });
  }

  try {
    const file = req.files.uploadedFile;
    // upload to s3
    const uploadedFile = await awsLib.uploadFile(file);
    const { Location, key } = uploadedFile;

    const body = {
      audio_url: Location,
    };

    // call aai api
    const response = await fetch(process.env.ASSEMBLYAI_API_URL, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        authorization: process.env.ASSEMBLYAI_API_KEY,
        "content-type": "application/json",
      },
    });

    const result = await response.json();
    if (result.error) {
      console.log(result);
      res.status(500).json({
        success: false,
        error: "There was an error uploading your file.",
      });
      return;
    }

    // get user email
    const user = await db.getSingleUserById(Number(id));
    const { email } = user;

    // save transcript id to db
    const recording = await db.createRecording(
      file.name,
      key,
      result.id,
      email
    );
    res.status(200).json({ success: true, data: recording });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      error: "There was an error uploading your file.",
    });
  }
});

app.get("/uploads", jwtLib.authorize, async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, error: "You must provide the user id." });
  }

  try {
    const recordings = await db.getAllRecordings(Number(id));

    const responses = recordings.map(async (rec) => {
      // call aai api
      const url = process.env.ASSEMBLYAI_API_URL + "/" + rec.transcriptId;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          authorization: process.env.ASSEMBLYAI_API_KEY,
          "content-type": "application/json",
        },
      });

      const result = await response.json();
      if (result.error) {
        console.log(result);
        res.status(500).json({
          success: false,
          error: "There was an error retrieving your recordings.",
        });
        return;
      }

      result.name = rec.name;

      return result;
    });

    const results = await Promise.all(responses);

    res.status(200).json({ success: true, data: results });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      error: "There was an error retrieving your recordings.",
    });
  }
});

app.post("/generate-pdf", jwtLib.authorize, async (req, res) => {
  const { transcriptId } = req.body;

  if (!transcriptId) {
    return res
      .status(400)
      .json({ success: false, error: "You must provide the transcript id." });
  }

  try {
    const url = process.env.ASSEMBLYAI_API_URL + "/" + transcriptId;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        authorization: process.env.ASSEMBLYAI_API_KEY,
        "content-type": "application/json",
      },
    });

    const result = await response.json();
    if (result.error) {
      console.log(result);
      res.status(500).json({
        success: false,
        error: "There was an error retrieving your recording.",
      });
      return;
    }

    const { text } = result;
    const recordingRecord = await db.getSingleRecording(transcriptId);
    const { name } = recordingRecord;

    pdfLib.generatePdf("Transcript", text, res);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      error: "There was an error retrieving your recordings.",
    });
  }
});

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () =>
  console.log(`
🚀 Server ready at: ${PORT}`)
);
