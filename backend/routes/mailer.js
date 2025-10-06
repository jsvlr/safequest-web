import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function sendEmailVerificationTransporter(to, link, displayName) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_APP_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  let mailOption = {
    from: `"SafeQuest: Emergency Evacuation Adventure" <${process.env.EMAIL_APP_USER}>`,
    to,
    subject: "Verify your email",
    html: `
    <body style="margin:0;padding:0;background-color:#f4f6f8;font-family: -apple-system, 'Luckiest Guy', Arial, sans-serif, 'Poppins';">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tr>
            <td align="center" style="padding:32px 16px;">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;border-collapse:collapse;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,0.06);">
                <tr>
                    <td style="background-color:#1f2933;padding:28px 24px;text-align:center;">
                    <img src="cid:SafeQuest-logo" alt="GAME logo" width="88" height="88" style="display:block;margin:0 auto 8px auto;border:0;outline:none;text-decoration:none;">
                    <div style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:0.4px;">SafeQuest</div>
                    </td>
                </tr>
                <tr>
                    <td style="padding:32px 28px 8px 28px;">
                    <h1 style="margin:0 0 12px 0;font-size:28px;line-height:1.15;color:#111827;font-weight:700;">Email Verification</h1>
                    <p style="margin:0;font-size:15px;line-height:1.6;color:#374151;">
                        Hello ${displayName},
                    </p>
                    </td>
                </tr>
                <tr>
                    <td style="padding:12px 28px 20px 28px;">
                    <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#374151;">
                        Thank you for registering for our game! To finish creating your account and secure your profile, please verify your email address by clicking the button below.
                    </p>
                    <div style="text-align:center;margin:22px 0;">
                        <a
                        href="${link}"
                        role="button"
                        aria-label="Verify your game email"
                        style="
                            display:inline-block;
                            text-decoration:none;
                            font-size:16px;
                            font-weight:600;
                            padding:14px 22px;
                            border-radius:8px;
                            background-color:#2b6cb0;
                            color:#ffffff;
                            box-shadow:0 4px 10px rgba(43,108,176,0.15);
                            border:1px solid rgba(0,0,0,0.02);
                        "
                        >VERIFY EMAIL</a>
                    </div>
                    <p style="margin:0 0 16px 0;font-size:13px;line-height:1.5;color:#6b7280;">
                        If the button doesn't work, copy and paste the following link into your browser:
                    </p>
                    <p style="word-break:break-all;margin:8px 0 0 0;font-size:13px;color:#2563eb;">
                        <a href="${link}" style="color:#2563eb;text-decoration:underline;">${link}</a>
                    </p>
                    </td>
                </tr>
                <tr>
                    <td style="padding:20px 28px 28px 28px;border-top:1px solid #eef2f6;">
                    <p style="margin:0 0 8px 0;font-size:13px;color:#6b7280;">
                        If you did not create an account, you can safely ignore this email.
                    </p>
                    <p style="margin:12px 0 0 0;font-size:13px;color:#6b7280;">
                        Best regards,<br>
                        <strong style="color:#111827;">The SafeQuest Team</strong>
                    </p>
                    </td>
                </tr>
                <tr>
                    <td style="padding:12px 18px 18px 18px;background-color:#f9fafb;text-align:center;font-size:12px;color:#9ca3af;">
                    <div style="max-width:520px;margin:0 auto;">
                        SafeQuest • University of Eastern Pangasinan • Binalonan City, Philippines<br>
                        © <span id="year"></span> SafeQuest. All rights reserved.
                    </div>
                    </td>
                </tr>
                </table>
            </td>
            </tr>
        </table>
        <script>
            (function(){ try { var y = new Date().getFullYear(); document.getElementById('year').textContent = y; } catch(e){} })();
        </script>
        </body>
    `,
    attachments: [
      {
        filename: "SafeQuest-logo.png",
        path: path.join(
          __dirname,
          "../../frontend/public/images/SafeQuest-logo.png"
        ),
        cid: "SafeQuest-logo",
      },
    ],
  };

  transporter.sendMail(mailOption, (error, info) => {
    if (error) {
      console.error("ERROR: ", error);
    }
    console.info("Message sent %s", info);
  });
}
