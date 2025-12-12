import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { Resend } from "npm:resend@6.5.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  email: string;
  resetUrl: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { email, resetUrl }: RequestBody = await req.json();

    if (!email || !resetUrl) {
      throw new Error("Email and resetUrl are required");
    }

    const { data: userData, error: userError } = await supabaseClient.auth.admin.listUsers();

    if (userError) {
      throw userError;
    }

    const user = userData.users.find((u) => u.email === email);

    if (user) {
      const token = generateSecureToken();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15);

      const { error: tokenError } = await supabaseClient
        .from("password_reset_tokens")
        .insert({
          user_id: user.id,
          token,
          expires_at: expiresAt.toISOString(),
        });

      if (tokenError) {
        throw tokenError;
      }

      const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
      const fullResetUrl = `${resetUrl}/${token}`;

      await resend.emails.send({
        from: "DAWALLY Security <security@dawally.com>",
        to: email,
        subject: "Reset Your DAWALLY Password",
        html: getPasswordResetEmailHtml(fullResetUrl),
        text: getPasswordResetEmailText(fullResetUrl),
      });
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Password reset request error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function generateSecureToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
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