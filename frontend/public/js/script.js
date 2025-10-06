const registrationForm = document.getElementById("registration-form");
const forms = document.querySelectorAll(".needs-validation");
const passwordInput = document.getElementById("password");

const passwordHelper = document.getElementById("password-helper");

passwordHelper.textContent = "";

let isPasswordValid = false;

// forms.forEach((form) => {
//   form.addEventListener(
//     "submit",
//     (ev) => {
//       if (!form.checkValidity()) {
//         ev.preventDefault();
//         ev.stopImmediatePropagation();
//       }
//       form.classList.add("was-validated");
//     },
//     false
//   );
// });

registrationForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!registrationForm.checkValidity()) {
    e.stopImmediatePropagation();
    registrationForm.classList.add("was-validated");
    return;
  }

  const formData = new FormData(e.target);
  const recaptchaToken = grecaptcha.getResponse();

  if (!recaptchaToken) {
    Swal.fire({
      icon: "warning",
      title: "Recaptcha failed",
      text: "please validated the recaptcha before submitting.",
      showCancelButton: true,
    });
    return;
  }

  verifyStrongPassword(formData.get("password"));

  if (
    !isPasswordValid ||
    formData.get("password") !== formData.get("password-confirm")
  ) {
    Swal.fire({
      icon: "warning",
      title: "Invalid password",
      text: "please check your password input",
      showCancelButton: true,
      backdrop: true,
    });
    return;
  }

  const userData = {
    email: formData.get("email"),
    password: formData.get("password"),
    username: formData.get("username"),
    gender: formData.get("gender"),
    recaptchaToken: recaptchaToken,
  };

  try {
    const response = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Process successful",
        confirmButtonText: "View Gmail Inbox",
        text: result.message,
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "https://mail.google.com";
        }
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Process failed",
        text: result.message,
        showCancelButton: true,
      });
    }
    grecaptcha.reset();
  } catch (error) {
    console.error("error: ", error);
    grecaptcha.reset();
  }
});

function verifyStrongPassword(password) {
  const validChar = 8;
  passwordHelper.textContent = "";
  if (password.length < validChar) {
    passwordHelper.textContent = "password must be at least 8 charactes long.";
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
}

passwordInput.addEventListener("input", (e) => {
  verifyStrongPassword(e.target.value);
});
