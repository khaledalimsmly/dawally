import { supabase } from './supabase';

const APP_URL = import.meta.env.VITE_APP_URL || 'https://dawally-ai-predictio-mxha.bolt.host';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export interface EmailResponse {
  success: boolean;
  error?: string;
}

export const sendWelcomeEmail = async (
  email: string,
  fullName: string
): Promise<EmailResponse> => {
  try {
    const dashboardUrl = `${APP_URL}/dashboard`;

    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        type: 'welcome',
        to: email,
        data: {
          fullName,
          dashboardUrl,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to send welcome email');
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const requestPasswordReset = async (email: string): Promise<EmailResponse> => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/request-password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        email,
        resetUrl: `${APP_URL}/reset-password`,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to request password reset');
    }

    return { success: true };
  } catch (error) {
    console.error('Error requesting password reset:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const validateResetToken = async (token: string): Promise<{
  valid: boolean;
  userId?: string;
  error?: string;
}> => {
  try {
    const { data, error } = await supabase.rpc('validate_reset_token', {
      reset_token: token,
    });

    if (error) throw error;

    if (!data || data.length === 0) {
      return { valid: false, error: 'Invalid or expired token' };
    }

    const tokenData = data[0];

    return {
      valid: tokenData.is_valid,
      userId: tokenData.user_id,
      error: !tokenData.is_valid ? 'Token has expired or been used' : undefined,
    };
  } catch (error) {
    console.error('Error validating reset token:', error);
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<EmailResponse> => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        token,
        newPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to reset password');
    }

    return { success: true };
  } catch (error) {
    console.error('Error resetting password:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

function generateSecureToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}
