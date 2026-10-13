
"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailFromUrl = params.get("email");

    if (emailFromUrl) {
      setEmail(emailFromUrl.trim().toLowerCase());
      setCheckingEmail(false);
      return;
    }

    window.location.replace("/forgot-password");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const normalizedCode = code.trim();

    if (!email) {
      setError("Please request a password reset code first.");
      return;
    }

    if (!/^\d{6}$/.test(normalizedCode)) {
      setError("Please enter the complete six-digit verification code.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-reset-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: normalizedCode,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            "Verification failed. Please check your code and try again."
        );
        return;
      }

      sessionStorage.setItem(
        "edgePortfolioPasswordResetEmail",
        email
      );

      sessionStorage.setItem(
        "edgePortfolioPasswordResetCode",
        normalizedCode
      );

      window.location.href = "/new-password";
    } catch {
      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (checkingEmail) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030303] px-5 text-white">
        <p className="text-sm text-zinc-400">
          Preparing verification...
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#030303] px-5 py-12 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link
            href="/login"
            aria-label="Edge Portfolio"
            className="inline-flex items-center justify-center"
          >
            <Image
              src="/branding/edge-portfolio-logo.png"
              alt="Edge Portfolio"
              width={320}
              height={120}
              priority
              className="h-auto w-64 object-contain sm:w-72"
            />
          </Link>

          <p className="mt-3 text-xs tracking-[0.25em] text-zinc-400">
            WEALTH · LEGACY · SECURITY
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-[#0a0a0a] p-7 shadow-2xl sm:p-9">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-8 w-8 text-emerald-400"
                aria-hidden="true"
              >
                <rect
                  x="5"
                  y="10"
                  width="14"
                  height="11"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />
                <path
                  d="M8 10V7a4 4 0 0 1 8 0v3"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
                <circle
                  cx="12"
                  cy="15"
                  r="1.3"
                  fill="currentColor"
                />
                <path
                  d="M12 16.5V18"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-semibold">
              Verify OTP
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              We have sent a six-digit verification code to your
              registered email address. Enter the code below to
              verify your identity and continue resetting your
              password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="code"
                className="mb-3 block text-center text-sm font-medium text-zinc-200"
              >
                Enter verification code
              </label>

              <input
                id="code"
                name="code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                minLength={6}
                maxLength={6}
                required
                autoFocus
                value={code}
                onChange={(event) =>
                  setCode(
                    event.target.value.replace(/\D/g, "").slice(0, 6)
                  )
                }
                placeholder="000000"
                aria-label="Six-digit verification code"
                className="w-full rounded-xl border border-zinc-700 bg-black px-4 py-5 text-center text-3xl font-semibold tracking-[0.55em] text-white outline-none transition placeholder:tracking-[0.55em] placeholder:text-zinc-700 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10"
              />

              <p className="mt-3 text-center text-xs text-zinc-500">
                Your verification code expires after 10 minutes.
              </p>
            </div>

            {error && (
              <p
                className="rounded-lg border border-red-900 bg-red-950/30 p-3 text-center text-sm leading-6 text-red-300"
                role="alert"
                aria-live="polite"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full rounded-lg bg-emerald-500 px-4 py-3 font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Verifying OTP..." : "Verify OTP"}
            </button>
          </form>

          <div className="mt-7 border-t border-zinc-800 pt-6 text-center">
            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
            >
              Request a new reset code
            </Link>

            <p className="mt-5">
              <Link
                href="/login"
                className="text-sm text-zinc-400 transition hover:text-white"
              >
                ← Back to sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Secure account verification · Edge Portfolio
        </p>
      </div>
    </main>
  );
}
