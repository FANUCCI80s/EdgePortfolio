
import { createHash, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";

const MAX_ATTEMPTS = 5;

function hashResetCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const code =
      typeof body.code === "string"
        ? body.code.trim()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    const confirmPassword =
      typeof body.confirmPassword === "string"
        ? body.confirmPassword
        : "";

    if (
      !email ||
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

    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter the six-digit reset code.",
        },
        { status: 400 }
      );
    }

    if (password.length < 8 || password.length > 128) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your new password must contain between 8 and 128 characters.",
        },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "The passwords do not match.",
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
          message:
            "The reset code is invalid or expired. Request a new code if necessary.",
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
          message:
            "The reset code is invalid or expired. Request a new code if necessary.",
        },
        { status: 400 }
      );
    }

    if (otp.expiresAt <= new Date()) {
      await prisma.otpCode.update({
        where: { id: otp.id },
        data: { status: "EXPIRED" },
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "Your reset code has expired. Request a new code.",
        },
        { status: 400 }
      );
    }

    if (otp.attempts >= MAX_ATTEMPTS) {
      await prisma.otpCode.update({
        where: { id: otp.id },
        data: { status: "EXPIRED" },
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "Too many attempts. Request a new reset code.",
        },
        { status: 400 }
      );
    }

    const suppliedHash = Buffer.from(
      hashResetCode(code),
      "hex"
    );

    const storedHash = Buffer.from(otp.codeHash, "hex");

    const codeMatches =
      suppliedHash.length === storedHash.length &&
      timingSafeEqual(suppliedHash, storedHash);

    if (!codeMatches) {
      await prisma.otpCode.update({
        where: { id: otp.id },
        data: {
          attempts: { increment: 1 },
          ...(otp.attempts + 1 >= MAX_ATTEMPTS
            ? { status: "EXPIRED" as const }
            : {}),
        },
      });

      return NextResponse.json(
        {
          success: false,
          message:
            otp.attempts + 1 >= MAX_ATTEMPTS
              ? "Too many attempts. Request a new reset code."
              : "The reset code is incorrect.",
        },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const resetSucceeded = await prisma.$transaction(
      async (tx) => {
        // Claim the code only if it remains valid and unused.
        // This prevents the same code being used twice.
        const claimed = await tx.otpCode.updateMany({
          where: {
            id: otp.id,
            userId: user.id,
            purpose: "PASSWORD_RESET",
            status: "PENDING",
            expiresAt: { gt: new Date() },
            attempts: { lt: MAX_ATTEMPTS },
            codeHash: otp.codeHash,
          },
          data: {
            status: "USED",
            usedAt: new Date(),
          },
        });

        if (claimed.count !== 1) {
          return false;
        }

        await tx.user.update({
          where: { id: user.id },
          data: { passwordHash },
        });

        // Invalidate any other outstanding reset codes.
        await tx.otpCode.updateMany({
          where: {
            userId: user.id,
            purpose: "PASSWORD_RESET",
            status: "PENDING",
          },
          data: { status: "EXPIRED" },
        });

        // Revoke existing database-backed sessions after a reset.
        await tx.session.deleteMany({
          where: { userId: user.id },
        });

        return true;
      }
    );

    if (!resetSucceeded) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The reset code is invalid or expired. Request a new code.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Your password has been reset successfully. Please sign in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to reset your password right now. Please try again.",
      },
      { status: 500 }
    );
  }
}
