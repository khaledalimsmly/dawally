import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Resend } from "npm:resend@6.5.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface EmailRequest {
  type: 'welcome' | 'password-reset';
  to: string;
  data: {
    fullName?: string;
    resetUrl?: string;
    dashboardUrl?: string;
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    if (!resend) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const { type, to, data }: EmailRequest = await req.json();

    let emailData: {
      from: string;
      to: string;
      subject: string;
      html: string;
      text: string;
    };

    if (type === 'welcome') {
      const { fullName, dashboardUrl } = data;

      if (!fullName || !dashboardUrl) {
        throw new Error("Missing required data for welcome email");
      }

      emailData = {
        from: "DAWALLY <onboarding@dawally.com>",
        to,
        subject: "Welcome to DAWALLY - Your AI Trading Partner",
        html: getWelcomeEmailHtml(fullName, dashboardUrl),
        text: getWelcomeEmailText(fullName, dashboardUrl),
      };
    } else if (type === 'password-reset') {
      const { resetUrl } = data;

      if (!resetUrl) {
        throw new Error("Missing required data for password reset email");
      }

      emailData = {
        from: "DAWALLY Security <security@dawally.com>",
        to,
        subject: "Reset Your DAWALLY Password",
        html: getPasswordResetEmailHtml(resetUrl),
        text: getPasswordResetEmailText(resetUrl),
      };
    } else {
      throw new Error("Invalid email type");
    }

    const result = await resend.emails.send(emailData);

    return new Response(
      JSON.stringify({ success: true, data: result }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Email sending error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function getWelcomeEmailHtml(fullName: string, dashboardUrl: string): string {
  return `
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
          <tr>
            <td style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); padding: 40px 30px; text-align: center;">
              <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%); border-radius: 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(20, 184, 166, 0.3);">
                <span style="font-size: 48px; color: white; font-weight: bold;">◆</span>
              </div>
              <h1 style="margin: 0; color: #FFFFFF; font-size: 32px; font-weight: 700;">Welcome to DAWALLY</h1>
              <p style="margin: 12px 0 0; color: #9CA3AF; font-size: 16px;">AI-Powered Stock Market Predictions</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px; background-color: #1F2937;">
              <h2 style="margin: 0 0 20px; color: #FFFFFF; font-size: 24px; font-weight: 600;">Hi ${fullName},</h2>
              <p style="margin: 0 0 20px; color: #D1D5DB; font-size: 16px; line-height: 1.6;">Welcome aboard! We're excited to have you join DAWALLY.</p>
              <div style="background-color: #374151; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 20px; color: #14B8A6; font-size: 18px; font-weight: 600;">What You Can Do Now:</h3>
                <div style="margin-bottom: 12px; color: #E5E7EB; font-size: 15px;">• AI-Powered Predictions</div>
                <div style="margin-bottom: 12px; color: #E5E7EB; font-size: 15px;">• Market Scanner</div>
                <div style="margin-bottom: 12px; color: #E5E7EB; font-size: 15px;">• Confidence Scoring</div>
                <div style="color: #E5E7EB; font-size: 15px;">• Risk Assessment</div>
              </div>
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td style="text-align: center; padding: 10px 0;">
                    <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%); color: #FFFFFF; text-decoration: none; padding: 16px 40px; border-radius: 10px; font-weight: 600; font-size: 16px;">Go to Dashboard →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

function getWelcomeEmailText(fullName: string, dashboardUrl: string): string {
  return `Welcome to DAWALLY, ${fullName}!\n\nGet Started: ${dashboardUrl}`;
}

function getPasswordResetEmailHtml(resetUrl: string): string {
  return `
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
          <tr>
            <td style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); padding: 40px 30px; text-align: center;">
              <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%); border-radius: 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(20, 184, 166, 0.3);">
                <span style="font-size: 48px; color: white; font-weight: bold;">◆</span>
              </div>
              <h1 style="margin: 0; color: #FFFFFF; font-size: 28px; font-weight: 700;">Reset Your Password</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px; background-color: #1F2937;">
              <p style="margin: 0 0 20px; color: #D1D5DB; font-size: 16px;">We received a request to reset your password.</p>
              <table role="presentation" style="width: 100%;">
                <tr>
                  <td style="text-align: center; padding: 10px 0;">
                    <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #14B8A6 0%, #0D9488 100%); color: #FFFFFF; text-decoration: none; padding: 18px 48px; border-radius: 10px; font-weight: 600; font-size: 16px;">Reset Password</a>
                  </td>
                </tr>
              </table>
              <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px 20px; margin: 30px 0; border-radius: 8px;">
                <p style="margin: 0; color: #78350F; font-size: 13px;">⚠️ This link expires in 15 minutes.</p>
              </div>
              <p style="margin: 0; color: #9CA3AF; font-size: 12px; word-break: break-all;">${resetUrl}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

function getPasswordResetEmailText(resetUrl: string): string {
  return `Reset Your DAWALLY Password\n\n${resetUrl}\n\n⚠️ This link expires in 15 minutes.`;
}