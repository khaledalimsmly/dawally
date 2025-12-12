# Email Functionality Setup Guide

This guide explains how to configure and use the email functionality in DAWALLY.

## Overview

DAWALLY uses **Resend** for sending emails through Supabase Edge Functions. Two email services are implemented:

1. **Welcome Email** - Sent automatically when a user signs up
2. **Password Reset Email** - Sent when a user requests to reset their password

## Architecture

The email functionality uses three Supabase Edge Functions:

1. **`send-email`** - Handles sending welcome emails after signup
2. **`request-password-reset`** - Creates reset tokens and sends password reset emails
3. **`reset-password`** - Validates tokens and updates user passwords

All password reset operations happen server-side for security.

## Configuration Steps

### 1. Get Your Resend API Key

1. Go to [Resend.com](https://resend.com/) and create an account
2. Navigate to your API Keys section
3. Create a new API key
4. Copy the API key (starts with `re_`)

### 2. Configure Supabase Edge Function

The Resend API key needs to be added to your Supabase project as a secret:

1. Go to your Supabase Dashboard
2. Navigate to **Edge Functions** → **Settings** → **Secrets**
3. Add a new secret:
   - **Name**: `RESEND_API_KEY`
   - **Value**: Your Resend API key from step 1

**Note:** The Edge Function will automatically have access to this secret. No manual configuration needed in code.

### 3. Verify Domain (Production)

For production use, you need to verify your sending domain with Resend:

1. In Resend Dashboard, go to **Domains**
2. Add your domain (e.g., `dawally.com`)
3. Add the provided DNS records to your domain registrar
4. Wait for verification (usually takes a few minutes)

### 4. Update Email Addresses (Optional)

If you want to customize the sender email addresses, edit the Edge Functions:
- Welcome emails: `/supabase/functions/send-email/index.ts`
- Password reset: `/supabase/functions/request-password-reset/index.ts`

Current sender addresses:
- Welcome emails: `DAWALLY <onboarding@dawally.com>`
- Password reset: `DAWALLY Security <security@dawally.com>`

**For testing:** Resend allows you to use `onboarding@resend.dev` without domain verification.

## Features Implemented

### Welcome Email
- ✅ Automatically sent after successful signup
- ✅ Beautiful HTML template with DAWALLY branding
- ✅ Links to dashboard
- ✅ Feature highlights
- ✅ Mobile responsive design

### Password Reset Flow
- ✅ "Forgot Password?" link on login page
- ✅ `/forgot-password` page with email input
- ✅ Secure token generation (32-character random)
- ✅ 15-minute token expiration
- ✅ Single-use tokens
- ✅ `/reset-password/:token` page with password validation
- ✅ Password strength indicator
- ✅ Success/error handling with toast notifications

### Database
- ✅ `password_reset_tokens` table created
- ✅ Row Level Security enabled
- ✅ Automatic cleanup of expired tokens
- ✅ Foreign key to `auth.users`

### Toast Notifications
- ✅ Success, error, warning, info types
- ✅ Auto-dismiss with countdown
- ✅ Stack multiple toasts
- ✅ Manual dismiss button
- ✅ Smooth animations

## Testing the Email Flow

### Test Welcome Email:
1. Navigate to `/signup`
2. Create a new account
3. Check the email inbox for the welcome email

### Test Password Reset:
1. Navigate to `/login`
2. Click "Forgot password?" link
3. Enter email address
4. Check inbox for reset email
5. Click the reset link
6. Enter new password
7. Confirm successful reset
8. Try logging in with new password

## Environment Variables

Required environment variables (already configured):

```env
VITE_SUPABASE_URL=https://eikhzwxjtpdxdwsbpwti.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_APP_URL=https://dawally-ai-predictio-mxha.bolt.host

# This is configured in Supabase Edge Function Secrets, not in .env
RESEND_API_KEY=your_resend_api_key
```

## Troubleshooting

### Emails Not Sending

1. **Check Resend API Key**: Verify the key is correctly set in Supabase Edge Function Secrets
2. **Check Edge Function Logs**: View logs in Supabase Dashboard → Edge Functions → Logs
3. **Domain Verification**: For production, ensure your domain is verified in Resend
4. **Rate Limits**: Resend has rate limits on free tier (100 emails/day)

### Password Reset Not Working

1. **Check Token Expiration**: Tokens expire after 15 minutes
2. **Check Database**: Verify `password_reset_tokens` table exists
3. **Check RLS Policies**: Ensure the validation function can read tokens
4. **Browser Console**: Check for JavaScript errors

### Welcome Email Not Triggering

1. **Check Signup**: Ensure signup completes successfully
2. **Check Console**: Look for "Failed to send welcome email" errors
3. **Non-blocking**: Welcome email failures don't block signup (by design)

## API Reference

### Email Service Functions

```typescript
// Send welcome email (called automatically on signup)
import { sendWelcomeEmail } from './lib/email';
await sendWelcomeEmail(email, fullName);

// Request password reset
import { requestPasswordReset } from './lib/email';
await requestPasswordReset(email);

// Validate reset token
import { validateResetToken } from './lib/email';
const result = await validateResetToken(token);

// Reset password
import { resetPassword } from './lib/email';
await resetPassword(token, newPassword);
```

### Toast Notifications

```typescript
import { useToast } from './contexts/ToastContext';

const { success, error, warning, info } = useToast();

success('Operation successful!');
error('Something went wrong');
warning('Please check your input');
info('Here\'s some information');
```

## Security Features

- ✅ Secure random token generation (crypto.getRandomValues)
- ✅ 15-minute token expiration
- ✅ Single-use tokens
- ✅ Tokens marked as used after reset
- ✅ No sensitive data in URLs except token
- ✅ RLS protection on token table
- ✅ Password strength validation
- ✅ Rate limiting consideration

## File Structure

```
src/
├── lib/
│   ├── email.ts                        # Email service functions
│   └── emailTemplates/
│       ├── welcome.ts                  # Welcome email HTML
│       └── passwordReset.ts            # Reset email HTML
├── contexts/
│   ├── AuthContext.tsx                 # Updated with welcome email
│   └── ToastContext.tsx                # Toast notification system
├── components/
│   └── Toast.tsx                       # Toast UI component
└── pages/
    ├── ForgotPassword.tsx              # Forgot password page
    └── ResetPassword.tsx               # Reset password page

supabase/
├── functions/
│   ├── send-email/
│   │   └── index.ts                    # Sends welcome emails
│   ├── request-password-reset/
│   │   └── index.ts                    # Creates tokens & sends reset emails
│   └── reset-password/
│       └── index.ts                    # Validates tokens & updates passwords
└── migrations/
    ├── create_password_reset_tokens.sql # Database schema
    └── fix_rls_security_issues.sql     # RLS security fixes
```

## Next Steps

1. **Configure Resend API Key** in Supabase Edge Function Secrets
2. **Test the flow** with a real email address
3. **Verify domain** for production use
4. **Customize email templates** if needed
5. **Monitor email delivery** in Resend Dashboard

## Support

For issues related to:
- **Resend**: Check [Resend Docs](https://resend.com/docs)
- **Supabase**: Check [Supabase Docs](https://supabase.com/docs)
- **This implementation**: Review the code comments and console logs
