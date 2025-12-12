export const getPasswordResetEmailHtml = (resetUrl: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your DAWALLY Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #111827; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #1F2937; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); padding: 40px 30px; text-align: center;">
              <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%); border-radius: 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(20, 184, 166, 0.3);">
                <span style="font-size: 48px; color: white; font-weight: bold;">◆</span>
              </div>
              <h1 style="margin: 0; color: #FFFFFF; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                Reset Your Password
              </h1>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px; background-color: #1F2937;">
              <p style="margin: 0 0 20px; color: #D1D5DB; font-size: 16px; line-height: 1.6;">
                We received a request to reset your password for your DAWALLY account.
              </p>
              <p style="margin: 0 0 30px; color: #D1D5DB; font-size: 16px; line-height: 1.6;">
                Click the button below to create a new password:
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td style="text-align: center; padding: 10px 0;">
                    <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%); color: #FFFFFF; text-decoration: none; padding: 18px 48px; border-radius: 10px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(20, 184, 166, 0.4);">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Security Warning -->
              <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px 20px; margin: 30px 0; border-radius: 8px;">
                <p style="margin: 0 0 8px; color: #92400E; font-size: 14px; font-weight: 600;">
                  ⚠️ Important Security Information
                </p>
                <p style="margin: 0; color: #78350F; font-size: 13px; line-height: 1.5;">
                  This password reset link will expire in <strong>15 minutes</strong> for your security. If you didn't request this, please ignore this email and your password will remain unchanged.
                </p>
              </div>

              <!-- Alternative Link -->
              <div style="background-color: #374151; border-radius: 10px; padding: 20px; margin: 20px 0;">
                <p style="margin: 0 0 12px; color: #9CA3AF; font-size: 13px;">
                  If the button above doesn't work, copy and paste this link into your browser:
                </p>
                <p style="margin: 0; color: #14B8A6; font-size: 12px; word-break: break-all; font-family: monospace;">
                  ${resetUrl}
                </p>
              </div>

              <p style="margin: 30px 0 0; color: #9CA3AF; font-size: 14px; line-height: 1.6;">
                For security reasons, never share this link with anyone. If you have any concerns, contact our support team immediately.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #111827; text-align: center;">
              <p style="margin: 0 0 12px; color: #6B7280; font-size: 14px;">
                DAWALLY - AI-Powered Stock Market Intelligence
              </p>
              <p style="margin: 0 0 16px; color: #6B7280; font-size: 12px;">
                Saudi Arabia
              </p>
              <p style="margin: 0; color: #4B5563; font-size: 12px;">
                This is an automated security email. Please do not reply to this message.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const getPasswordResetEmailText = (resetUrl: string) => `
Reset Your DAWALLY Password

We received a request to reset your password for your DAWALLY account.

Click the link below to create a new password:

${resetUrl}

⚠️ IMPORTANT SECURITY INFORMATION:

• This password reset link will expire in 15 minutes for your security.
• If you didn't request this, please ignore this email and your password will remain unchanged.
• Never share this link with anyone.

For security reasons, if you have any concerns, contact our support team immediately.

---
DAWALLY - AI-Powered Stock Market Intelligence
Saudi Arabia

This is an automated security email. Please do not reply to this message.
`;
