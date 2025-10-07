import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDre7rAa9ZpjFsCPy0_yZWRLIS3xgSWIQo",
  authDomain: "safequest-db.firebaseapp.com",
  databaseURL: "https://safequest-db-default-rtdb.firebaseio.com",
  projectId: "safequest-db",
  storageBucket: "safequest-db.firebasestorage.app",
  messagingSenderId: "688619850297",
  appId: "1:688619850297:web:2f13a361ffb5235db69be8",
  measurementId: "G-5NRJHMP13D",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

const registrationForm = document.getElementById("registration-form");
const passwordInput = document.getElementById("password");
const passwordHelper = document.getElementById("password-helper");

passwordHelper.textContent = "";
let isPasswordValid = false;

registrationForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Check form validity
  if (!registrationForm.checkValidity()) {
    e.stopImmediatePropagation();
    registrationForm.classList.add("was-validated");
    return;
  }

  // Check reCAPTCHA
  if (typeof grecaptcha === "undefined") {
    showAlert(
      "error",
      "reCAPTCHA Error",
      "reCAPTCHA not loaded. Please refresh the page."
    );
    return;
  }

  const recaptchaToken = grecaptcha.getResponse();
  if (!recaptchaToken) {
    showAlert(
      "warning",
      "reCAPTCHA Required",
      "Please complete the reCAPTCHA validation."
    );
    return;
  }

  const formData = new FormData(e.target);
  const password = formData.get("password");
  const confirmPassword = formData.get("password-confirm");

  // Validate password
  verifyStrongPassword(password);

  if (!isPasswordValid || password !== confirmPassword) {
    showAlert(
      "warning",
      "Invalid Password",
      "Please check your password requirements and confirmation."
    );
    return;
  }

  // Get form data
  const userData = {
    email: formData.get("email"),
    password: password,
    username: formData.get("username"),
    gender: formData.get("gender"),
  };

  // Register user
  await registerUser(userData);
});

async function registerUser(userData) {
  try {
    showLoadingAlert(
      "Registering...",
      "Please wait while we create your account."
    );

    // 1. Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );

    const user = userCredential.user;

    // 2. Store user profile in Realtime Database
    await set(ref(database, "players/" + user.uid), {
      username: userData.username,
      gender: userData.gender,
      email: userData.email,
      isCurrentPlayer: false,
      level: 1,
      score: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      lastLogin: Date.now(),
    });

    // 3. Send email verification
    await sendEmailVerification(user);

    // 4. Update user profile with display name
    await updateProfile(user, {
      displayName: userData.username,
    });

    // Success
    Swal.fire({
      icon: "success",
      title: "Registration Successful!",
      html: `
        <p>Welcome, ${userData.username}!</p>
        <p>We've sent a verification email to <strong>${userData.email}</strong>.</p>
        <p>Please check your inbox and verify your email address.</p>
      `,
      confirmButtonText: "Got it!",
    });

    // Reset form
    registrationForm.reset();
    registrationForm.classList.remove("was-validated");
  } catch (error) {
    console.error("Registration error:", error);
    handleRegistrationError(error);
  } finally {
    // Reset reCAPTCHA
    if (typeof grecaptcha !== "undefined") {
      grecaptcha.reset();
    }
  }
}

function handleRegistrationError(error) {
  let errorMessage = "Registration failed. Please try again.";

  switch (error.code) {
    case "auth/email-already-in-use":
      errorMessage =
        "This email is already registered. Please use a different email or try logging in.";
      break;
    case "auth/invalid-email":
      errorMessage =
        "The email address is not valid. Please check and try again.";
      break;
    case "auth/weak-password":
      errorMessage =
        "The password is too weak. Please choose a stronger password.";
      break;
    case "auth/network-request-failed":
      errorMessage =
        "Network error. Please check your internet connection and try again.";
      break;
    case "auth/too-many-requests":
      errorMessage = "Too many attempts. Please try again later.";
      break;
    case "database/permission-denied":
      errorMessage =
        "Permission denied. Please refresh the page and try again.";
      break;
  }

  Swal.fire({
    icon: "error",
    title: "Registration Failed",
    text: errorMessage,
    confirmButtonText: "Try Again",
  });
}

function showLoadingAlert(title, text) {
  Swal.fire({
    title: title,
    text: text,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
}

function showAlert(icon, title, text) {
  Swal.fire({
    icon: icon,
    title: title,
    text: text,
    confirmButtonText: "OK",
  });
}

// Your existing password validation function
function verifyStrongPassword(password) {
  const validChar = 8;
  passwordHelper.textContent = "";
  isPasswordValid = false;

  if (password.length < validChar) {
    passwordHelper.textContent = "Password must be at least 8 characters long.";
    return;
  }

  const hasLowerCase = /[a-z]/.test(password);
  if (!hasLowerCase) {
    passwordHelper.textContent =
      "Password must contain at least one lowercase letter.";
    return;
  }

  const hasDigit = /\d/.test(password);
  if (!hasDigit) {
    passwordHelper.textContent = "Password must contain at least one digit.";
    return;
  }

  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  if (!hasSpecialChar) {
    passwordHelper.textContent =
      "Password must contain at least one special character.";
    return;
  }

  isPasswordValid = true;
  passwordHelper.textContent = "✓ Password is strong";
  passwordHelper.style.color = "green";
}

passwordInput.addEventListener("input", (e) => {
  verifyStrongPassword(e.target.value);
});
