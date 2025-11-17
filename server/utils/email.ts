import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

/**
 * Send email to single recipient
 */
export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<boolean> => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.warn('Email not configured. Skipping email send.');
      return false;
    }

    await transporter.sendMail({
      from: `"Student Hub" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

/**
 * Send bulk emails
 */
export const sendBulkEmail = async (
  recipients: string[],
  subject: string,
  html: string
): Promise<{ success: number; failed: number }> => {
  let success = 0;
  let failed = 0;

  for (const recipient of recipients) {
    const sent = await sendEmail(recipient, subject, html);
    if (sent) success++;
    else failed++;
  }

  return { success, failed };
};

/**
 * Email templates
 */
export const emailTemplates = {
  announcement: (title: string, message: string, link?: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${title}</h1>
        </div>
        <div class="content">
          <p>${message}</p>
          ${link ? `<a href="${link}" class="button">Learn More</a>` : ''}
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} Student Hub. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  contentApproved: (contentType: string, contentTitle: string, link: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .success { background: #10b981; color: white; padding: 20px; border-radius: 10px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; margin-top: 20px; border-radius: 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="success">
          <h1>✓ Content Approved!</h1>
        </div>
        <div class="content">
          <p>Great news! Your ${contentType} <strong>"${contentTitle}"</strong> has been approved by our moderation team.</p>
          <p>It is now visible to all users on the platform.</p>
          <a href="${link}" class="button">View ${contentType}</a>
        </div>
      </div>
    </body>
    </html>
  `,

  contentRejected: (contentType: string, contentTitle: string, reason: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .warning { background: #f59e0b; color: white; padding: 20px; border-radius: 10px; text-align: center; }
        .content { background: #f9f9f9; padding: 30px; margin-top: 20px; border-radius: 10px; }
        .reason { background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="warning">
          <h1>Content Not Approved</h1>
        </div>
        <div class="content">
          <p>Your ${contentType} <strong>"${contentTitle}"</strong> was reviewed but did not meet our content guidelines.</p>
          <div class="reason">
            <strong>Reason:</strong> ${reason}
          </div>
          <p>You can edit and resubmit your content for review.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  bulkImportWelcome: (name: string, email: string, tempPassword: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .credentials { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; border: 2px dashed #667eea; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Student Hub!</h1>
        </div>
        <div class="content">
          <p>Hi ${name},</p>
          <p>Your account has been created on Student Hub. Here are your login credentials:</p>
          <div class="credentials">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Temporary Password:</strong> ${tempPassword}</p>
          </div>
          <p><strong>Important:</strong> Please change your password after your first login for security.</p>
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login" class="button">Login Now</a>
        </div>
      </div>
    </body>
    </html>
  `
};
