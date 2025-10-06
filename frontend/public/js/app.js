import { auth, provider, signInWithPopup, signOut } from "./firebase-config.js";

async function verifyWithBackend(idToken) {
  try {
    const response = await fetch("/api/auth/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    const data = await response.json();
    if (data.success) {
      console.log("Backend verification successful");
    }
  } catch (error) {
    console.error("Backend verification failed:", error);
  }
}
