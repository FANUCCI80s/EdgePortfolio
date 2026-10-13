
import { createHash, randomInt } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email/send";

const OTP_EXPIRATION_MINUTES = 10;
const RESEND_COOLDOWN_SECONDS = 60;

const GENERIC_MESSAGE =
  "If an account exists for that email, password reset instructions will be sent.";

function hashResetCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    if (
      !email ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter a valid email address.",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
      },
    });

    // Return the same response whether or not the account exists.
    if (!user) {
      return NextResponse.json({
        success: true,
        message: GENERIC_MESSAGE,
      });
    }

    const recentCode = await prisma.otpCode.findFirst({
      where: {
        userId: user.id,
        purpose: "PASSWORD_RESET",
        status: "PENDING",
        createdAt: {
          gte: new Date(
            Date.now() - RESEND_COOLDOWN_SECONDS * 1000
          ),
        },
      },
      select: { id: true },
    });

    // Avoid repeatedly emailing reset codes.
    if (recentCode) {
      return NextResponse.json({
        success: true,
        message: GENERIC_MESSAGE,
      });
    }

    // Invalidate any older unused reset codes.
    await prisma.otpCode.updateMany({
      where: {
        userId: user.id,
        purpose: "PASSWORD_RESET",
        status: "PENDING",
      },
      data: {
        status: "EXPIRED",
      },
    });

    const code = randomInt(100000, 1000000).toString();
    const codeHash = hashResetCode(code);

    const expiresAt = new Date(
      Date.now() + OTP_EXPIRATION_MINUTES * 60 * 1000
    );

    const otp = await prisma.otpCode.create({
      data: {
        userId: user.id,
        codeHash,
        purpose: "PASSWORD_RESET",
        status: "PENDING",
        expiresAt,
      },
    });

    const safeFirstName = escapeHtml(user.firstName);
    const safeCode = escapeHtml(code);

    try {
      await sendEmail({
        to: user.email,
        subject: "Reset your Edge Portfolio password",
        text: `Hello ${user.firstName},

We received a request to reset your Edge Portfolio password.

Your password reset code is: ${code}

This code expires in ${OTP_EXPIRATION_MINUTES} minutes.

If you did not request a password reset, you can ignore this email.

Edge Portfolio`,
        html: `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Reset Your Password</title>
            </head>
            <body style="margin:0;padding:32px 16px;background:#030303;font-family:Arial,Helvetica,sans-serif;color:#ffffff;">
              <div style="max-width:560px;margin:0 auto;padding:36px 28px;background:#0a0a0a;border:1px solid #292929;">
                <div style="text-align:center;margin-bottom:28px;">
                  <h1 style="margin:0;color:#22c55e;font-size:25px;">Edge Portfolio</h1>
                  <p style="color:#888888;font-size:11px;letter-spacing:3px;">WEALTH · LEGACY · SECURITY</p>
                </div>

                <div style="height:2px;background:#22c55e;margin-bottom:30px;"></div>

                <h2 style="font-size:25px;font-weight:400;">Reset Your Password</h2>

                <p style="color:#cccccc;line-height:1.8;">
                  Hello ${safeFirstName},
                </p>

                <p style="color:#999999;line-height:1.8;">
                  Use the verification code below to reset your Edge Portfolio password.
                </p>

                <div style="margin:28px 0;padding:24px 12px;background:#111111;border:1px solid #333333;text-align:center;">
                  <p style="margin:0 0 12px;color:#888888;font-size:11px;letter-spacing:2px;">
                    YOUR RESET CODE
                  </p>
                  <div style="font-size:36px;font-weight:700;letter-spacing:9px;color:#ffffff;">
                    ${safeCode}
                  </div>
                  <p style="margin:16px 0 0;color:#22c55e;font-size:12px;">
                    Expires in 10 minutes
                  </p>
                </div>

                <p style="color:#888888;font-size:13px;line-height:1.8;">
                  If you did not request this password reset, ignore this email.
                  Never share your verification code with anyone.
                </p>

                <div style="border-top:1px solid #292929;margin-top:30px;padding-top:20px;text-align:center;color:#666666;font-size:11px;">
                  Edge Portfolio · Wealth · Legacy · Security
                </div>
              </div>
            </body>
          </html>
        `,
      });
    } catch (emailError) {
      console.error("Password reset email failed:", emailError);

      await prisma.otpCode.update({
        where: { id: otp.id },
        data: { status: "EXPIRED" },
      });

      // Do not reveal account existence in the response.
      return NextResponse.json({
        success: true,
        message: GENERIC_MESSAGE,
      });
    }

    return NextResponse.json({
      success: true,
      message: GENERIC_MESSAGE,
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to process the request right now. Please try again.",
      },
      { status: 500 }
    );
  }
}

