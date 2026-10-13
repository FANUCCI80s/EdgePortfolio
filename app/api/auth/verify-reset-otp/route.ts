
import { createHash, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MAX_ATTEMPTS = 5;

function hashResetCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

const INVALID_CODE_MESSAGE =
  "The reset code is invalid or expired. Please check the code or request a new one.";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const email =
      typeof body?.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const code =
      typeof body?.code === "string"
        ? body.code.trim()
        : "";

    if (
      !email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !/^\d{6}$/.test(code)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter a valid email address and six-digit reset code.",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: INVALID_CODE_MESSAGE,
        },
        { status: 400 }
      );
    }

    const otp = await prisma.otpCode.findFirst({
      where: {
        userId: user.id,
        purpose: "PASSWORD_RESET",
        status: "PENDING",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!otp) {
      return NextResponse.json(
        {
          success: false,
          message: INVALID_CODE_MESSAGE,
        },
        { status: 400 }
      );
    }

    if (otp.expiresAt <= new Date()) {
      await prisma.otpCode.updateMany({
        where: {
          id: otp.id,
          status: "PENDING",
        },
        data: {
          status: "EXPIRED",
        },
      });

      return NextResponse.json(
        {
          success: false,
          message: "Your reset code has expired. Please request a new one.",
        },
        { status: 400 }
      );
    }

    if (otp.attempts >= MAX_ATTEMPTS) {
      await prisma.otpCode.updateMany({
        where: {
          id: otp.id,
          status: "PENDING",
        },
        data: {
          status: "EXPIRED",
        },
      });

      return NextResponse.json(
        {
          success: false,
          message: "Too many attempts. Please request a new reset code.",
        },
        { status: 400 }
      );
    }

    const suppliedHash = Buffer.from(hashResetCode(code), "hex");
    const storedHash = Buffer.from(otp.codeHash, "hex");

    const codeMatches =
      suppliedHash.length === storedHash.length &&
      timingSafeEqual(suppliedHash, storedHash);

    if (!codeMatches) {
      const nextAttempts = otp.attempts + 1;

      await prisma.otpCode.updateMany({
        where: {
          id: otp.id,
          status: "PENDING",
          attempts: otp.attempts,
        },
        data: {
          attempts: { increment: 1 },
          ...(nextAttempts >= MAX_ATTEMPTS
            ? { status: "EXPIRED" as const }
            : {}),
        },
      });

      return NextResponse.json(
        {
          success: false,
          message:
            nextAttempts >= MAX_ATTEMPTS
              ? "Too many attempts. Please request a new reset code."
              : "The reset code is incorrect.",
        },
        { status: 400 }
      );
    }

    // Leave the code pending here. The password-reset API
    // revalidates it and marks it USED when the password changes.
    return NextResponse.json({
      success: true,
      message: "Email verified. You can now choose a new password.",
    });
  } catch (error) {
    console.error("Reset OTP verification error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to verify your code right now. Please try again.",
      },
      { status: 500 }
    );
  }
}
