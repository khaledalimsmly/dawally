export const getWelcomeEmailHtml = (fullName: string, dashboardUrl: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to DAWALLY</title>
</head>
<body style="margin: 0; padding: 0; background-color: #111827; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #1F2937; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);">

          <!-- Header with gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); padding: 40px 30px; text-align: center;">
              <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%); border-radius: 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(20, 184, 166, 0.3);">
                <span style="font-size: 48px; color: white; font-weight: bold;">◆</span>
              </div>
              <h1 style="margin: 0; color: #FFFFFF; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                Welcome to DAWALLY
              </h1>
              <p style="margin: 12px 0 0; color: #9CA3AF; font-size: 16px;">
                AI-Powered Stock Market Predictions
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px; background-color: #1F2937;">
              <h2 style="margin: 0 0 20px; color: #FFFFFF; font-size: 24px; font-weight: 600;">
                Hi ${fullName},
              </h2>
              <p style="margin: 0 0 20px; color: #D1D5DB; font-size: 16px; line-height: 1.6;">
                Welcome aboard! We're excited to have you join DAWALLY, the most advanced AI-powered platform for Saudi stock market predictions.
              </p>
              <p style="margin: 0 0 30px; color: #D1D5DB; font-size: 16px; line-height: 1.6;">
                Your account is now active and ready to help you make smarter trading decisions with confidence.
              </p>

              <!-- Features Section -->
              <div style="background-color: #374151; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 20px; color: #14B8A6; font-size: 18px; font-weight: 600;">
                  What You Can Do Now:
                </h3>

                <div style="margin-bottom: 16px;">
                  <div style="display: inline-block; width: 8px; height: 8px; background-color: #14B8A6; border-radius: 50%; margin-right: 10px; vertical-align: middle;"></div>
                  <span style="color: #E5E7EB; font-size: 15px; line-height: 1.6;">
                    <strong style="color: #FFFFFF;">AI-Powered Predictions</strong> - Get multi-timeframe forecasts for any Saudi stock
                  </span>
                </div>

                <div style="margin-bottom: 16px;">
                  <div style="display: inline-block; width: 8px; height: 8px; background-color: #14B8A6; border-radius: 50%; margin-right: 10px; vertical-align: middle;"></div>
                  <span style="color: #E5E7EB; font-size: 15px; line-height: 1.6;">
                    <strong style="color: #FFFFFF;">Market Scanner</strong> - Discover unusual volume, sentiment spikes, and volatility opportunities
                  </span>
                </div>

                <div style="margin-bottom: 16px;">
                  <div style="display: inline-block; width: 8px; height: 8px; background-color: #14B8A6; border-radius: 50%; margin-right: 10px; vertical-align: middle;"></div>
                  <span style="color: #E5E7EB; font-size: 15px; line-height: 1.6;">
                    <strong style="color: #FFFFFF;">Confidence Scoring</strong> - See how confident our AI is about each prediction
                  </span>
                </div>

                <div>
                  <div style="display: inline-block; width: 8px; height: 8px; background-color: #14B8A6; border-radius: 50%; margin-right: 10px; vertical-align: middle;"></div>
                  <span style="color: #E5E7EB; font-size: 15px; line-height: 1.6;">
                    <strong style="color: #FFFFFF;">Risk Assessment</strong> - Understand the risk level before making any move
                  </span>
                </div>
              </div>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td style="text-align: center; padding: 10px 0;">
                    <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%); color: #FFFFFF; text-decoration: none; padding: 16px 40px; border-radius: 10px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(20, 184, 166, 0.4); transition: transform 0.2s;">
                      Go to Dashboard →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 0; color: #9CA3AF; font-size: 14px; line-height: 1.6;">
                Need help getting started? Visit our Help Center or reply to this email - we're here to help!
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
                You're receiving this email because you created an account on DAWALLY.
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

export const getWelcomeEmailText = (fullName: string, dashboardUrl: string) => `
Welcome to DAWALLY, ${fullName}!

We're excited to have you join our AI-powered stock market prediction platform.

Your account is now active and ready to help you make smarter trading decisions with confidence.

What You Can Do Now:

• AI-Powered Predictions - Get multi-timeframe forecasts for any Saudi stock
• Market Scanner - Discover unusual volume, sentiment spikes, and volatility opportunities
• Confidence Scoring - See how confident our AI is about each prediction
• Risk Assessment - Understand the risk level before making any move

Get Started: ${dashboardUrl}

Need help getting started? Visit our Help Center or reply to this email - we're here to help!

---
DAWALLY - AI-Powered Stock Market Intelligence
Saudi Arabia

You're receiving this email because you created an account on DAWALLY.
`;
