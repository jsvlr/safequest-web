import { auth, provider, signInWithPopup, signOut } from "./firebase-config.js";

// DOM Elements
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const userInfo = document.getElementById("user-info");

// Auth state listener
auth.onAuthStateChanged(async (user) => {
  if (user) {
    // User is signed in
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";

    // Get ID token and verify with backend
    const idToken = await user.getIdToken();
    verifyWithBackend(idToken);

    userInfo.innerHTML = `
      <p>Welcome, ${user.displayName}!</p>
      <p>Email: ${user.email}</p>
    `;
  } else {
    // User is signed out
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
    userInfo.innerHTML = "<p>Please log in to continue.</p>";
  }
});

// Login function
loginBtn.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Login error:", error);
  }
});

// Logout function
logoutBtn.addEventListener("click", () => {
  signOut(auth);
});

// Verify token with backend
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
