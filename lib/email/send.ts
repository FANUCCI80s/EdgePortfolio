import { Resend } from "resend";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.EMAIL_FROM;

if (!resendApiKey) {
  throw new Error("RESEND_API_KEY is not configured.");
}

if (!fromEmail) {
  throw new Error("EMAIL_FROM is not configured.");
}

const resend = new Resend(resendApiKey);

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: SendEmailOptions): Promise<void> {
  const { error } = await resend.emails.send({
    from: fromEmail,
    to,
    subject,
    html,
    text,
  });

  if (error) {
    throw new Error(error.message);
  }
}