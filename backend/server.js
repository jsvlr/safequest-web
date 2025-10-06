import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import admin from "./config/firebase-admin.js";
import { sendEmailVerificationTransporter } from "./routes/mailer.js";
import axios from "axios";

// Load environment variables

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../frontend/public")));

const verifyRecaptcha = async (req, res, next) => {
  const { recaptchaToken } = req.body;

  if (!recaptchaToken) {
    return res.status(400).json({ error: "recaptcha token required!" });
  }

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET,
          response: recaptchaToken,
        },
      }
    );

    const { success } = response.data;

    if (!success) {
      return res.status(400).json({ error: "reCAPTCHA verification error!" });
    }
    next();
  } catch (error) {
    console.error("recaptcha verification error: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

app.post("/register", verifyRecaptcha, async (req, res) => {
  const { email, password, username, gender } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      emailVerified: false,
    });

    const uid = userRecord.uid;

    await admin
      .database()
      .ref("players/" + uid)
      .set({
        username: username,
        gender: gender,
        isCurrentPlayer: false,
        level: 1,
        score: 0,
        createdAt: admin.database.ServerValue.TIMESTAMP,
        updatedAt: admin.database.ServerValue.TIMESTAMP,
        lastLogin: admin.database.ServerValue.TIMESTAMP,
      });

    const actionCodeSettings = {
      url: "https://safequest-db.web.app",
      handleCodeInApp: true,
    };

    const link = await admin
      .auth()
      .generateEmailVerificationLink(email, actionCodeSettings);

    await sendEmailVerificationTransporter(email, link, username);

    return res.status(200).json({
      message: "User registered and Email verification has been sent!",
    });
  } catch (error) {
    console.error("Registration error: ", error);

    switch (error.code) {
      case "auth/email-already-exists":
        return res
          .status(400)
          .json({ message: "Email is already registered!" });
      case "auth/invalid-email":
        return res.status(400).json({ message: "Invalid email address!" });
      case "auth/weak-password":
        return res.status(400).json({ message: "Password is too weak!" });
      case "auth/operation-not-allowed":
        return res.status(400).json({
          message:
            "Email/password accounts are not enabled. Please contact support.",
        });
      default:
        return res.status(500).json({
          message: "Failed to create user account. Please try again.",
        });
    }
  }
});

// comment this on production
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(
    "Environment loaded:",
    process.env.FIREBASE_PROJECT_ID
      ? "Firebase config found"
      : "No Firebase config"
  );
});
