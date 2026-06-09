import nodemailer from "nodemailer";
import { logger } from "./logger.js";

interface ContactEmail {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function createTransporter() {
  const user = process.env.GMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: { user, pass },
    });
  }

  if (user && pass) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }

  return null;
}

export async function sendContactNotification(data: ContactEmail): Promise<boolean> {
  const transporter = createTransporter();

  if (!transporter) {
    logger.warn("Email not configured — contact saved to database only. Set GMAIL_USER and GMAIL_APP_PASSWORD env vars to enable email notifications.");
    return false;
  }

  const toEmail = "cengmansoor@gmail.com";
  const fromEmail = process.env.GMAIL_USER || process.env.SMTP_USER || "noreply@edhtechnalogy.com";

  try {
    await transporter.sendMail({
      from: `"EDH Technology Website" <${fromEmail}>`,
      to: toEmail,
      replyTo: data.email,
      subject: `[EDH Website] New Contact: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f1929; color: #e2e8f0; padding: 32px; border-radius: 12px;">
          <div style="text-align: center; margin-bottom: 28px;">
            <h1 style="color: #00e5ff; font-size: 22px; margin: 0;">New Contact Form Submission</h1>
            <p style="color: #94a3b8; margin: 8px 0 0;">EDH Technology Website</p>
          </div>
          <div style="background: #1a2740; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #94a3b8; width: 100px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${data.name}</td></tr>
              <tr><td style="padding: 8px 0; color: #94a3b8;">Email</td><td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #00e5ff;">${data.email}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #94a3b8;">Subject</td><td style="padding: 8px 0; font-weight: 600;">${data.subject}</td></tr>
            </table>
          </div>
          <div style="background: #1a2740; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <p style="color: #94a3b8; margin: 0 0 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Message</p>
            <p style="margin: 0; line-height: 1.7; white-space: pre-wrap;">${data.message}</p>
          </div>
          <div style="text-align: center; color: #64748b; font-size: 12px;">
            <p>Reply directly to this email to respond to ${data.name}</p>
            <p>EDH Technology — Plan • Build • Test • Launch</p>
          </div>
        </div>
      `,
      text: `New contact from ${data.name} (${data.email})\n\nSubject: ${data.subject}\n\nMessage:\n${data.message}\n\n---\nReply to: ${data.email}`,
    });

    logger.info({ to: toEmail, from: data.email }, "Contact notification email sent");
    return true;
  } catch (err) {
    logger.error({ err }, "Failed to send contact notification email");
    return false;
  }
}
