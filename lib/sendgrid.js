import sgMail from '@sendgrid/mail';

export const initSendGrid = () => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
};

export const sendVerificationEmail = async (email, token, username) => {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
  
  const msg = {
    to: email,
    from: process.env.EMAIL_FROM, // Your verified sender in SendGrid
    subject: 'Verify Your Email - Leveling System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333; text-align: center;">Email Verification</h2>
        <p>Hello ${username || 'there'},</p>
        <p>Thank you for registering with Leveling System. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #0e795a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a>
        </div>
        <p>If you didn't create an account, you can safely ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error('SendGrid error:', error.response ? error.response.body : error);
    return { success: false, error };
  }
};

export const sendPasswordResetEmail = async (email, token, username) => {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
  
  const msg = {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: 'Reset Your Password - Leveling System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333; text-align: center;">Password Reset</h2>
        <p>Hello ${username || 'there'},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #0e795a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
        </div>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error('SendGrid error:', error);
    return { success: false, error };
  }
};

export const sendLoginNotificationEmail = async (email, username, loginTime, browserInfo) => {
  const msg = {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: 'New Login Detected - Leveling System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333; text-align: center;">New Login Alert</h2>
        <p>Hello ${username || 'there'},</p>
        <p>We detected a new login to your Leveling System account.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <p><strong>Time:</strong> ${loginTime}</p>
          <p><strong>Browser/Device:</strong> ${browserInfo}</p>
        </div>
        <p>If this was you, you can ignore this message. If you didn't log in recently, please reset your password immediately.</p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error('SendGrid error:', error);
    return { success: false, error };
  }
};