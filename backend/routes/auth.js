import express from "express";
import admin from "../config/firebase-admin.js";

const router = express.Router();

// Verify Firebase token
router.post("/verify", async (req, res) => {
  try {
    const { idToken } = req.body;

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    res.json({
      success: true,
      user: decodedToken,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
