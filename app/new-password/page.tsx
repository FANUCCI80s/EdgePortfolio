
"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

export default function NewPasswordPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const savedEmail = sessionStorage.getItem(
      "edgePortfolioPasswordResetEmail"
    );
    const savedCode = sessionStorage.getItem(
      "edgePortfolioPasswordResetCode"
    );

    if (
      !savedEmail ||
      !savedCode ||
      !/^\d{6}$/.test(savedCode)
    ) {
      window.location.replace("/reset-password");
      return;
    }

    setEmail(savedEmail);
    setCode(savedCode);
    setCheckingVerification(false);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email || !/^\d{6}$/.test(code)) {
      setError("Please verify your email with a valid reset code first.");
      window.location.href = "/reset-password";
      return;
    }

    if (password.length < 8 || password.length > 128) {
      setError("Your password must contain between 8 and 128 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            "Unable to reset your password. Please try again."
        );
        return;
      }

      sessionStorage.removeItem("edgePortfolioPasswordResetEmail");
      sessionStorage.removeItem("edgePortfolioPasswordResetCode");

      setPassword("");
      setConfirmPassword("");
      setCode("");
      setSubmitted(true);
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (checkingVerification) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030303] px-5 text-white">
        <p className="text-sm text-zinc-400">
          Checking email verification...
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
            aria-label="Edge Portfolio sign in"
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
          {submitted ? (
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-2xl text-emerald-400">
                ✓
              </div>

              <h1 className="text-2xl font-semibold">
                Password reset successful
              </h1>

              <p className="mt-4 text-sm leading-6 text-emerald-300">
                Your password has been updated successfully.
                You can now sign in using your new password.
              </p>

              <Link
                href="/login"
                className="mt-7 inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-3 font-semibold text-black transition hover:bg-emerald-400"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-7">
                <h1 className="text-2xl font-semibold">
                  Create a new password
                </h1>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Your email has been verified. Choose a strong
                  new password for your Edge Portfolio account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-zinc-200"
                  >
                    New Password
                  </label>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={128}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your new password"
                    className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10"
                  />

                  <p className="mt-2 text-xs text-zinc-500">
                    Use at least 8 characters.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-zinc-200"
                  >
                    Confirm New Password
                  </label>

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={128}
                    required
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Enter your new password again"
                    className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10"
                  />
                </div>

                {error && (
                  <p
                    className="rounded-lg border border-red-900 bg-red-950/30 p-3 text-sm leading-6 text-red-300"
                    role="alert"
                    aria-live="polite"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-emerald-500 px-4 py-3 font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Updating password..." : "Update Password"}
                </button>
              </form>
            </>
          )}

          {!submitted && (
            <div className="mt-7 border-t border-zinc-800 pt-6 text-center">
              <Link
                href="/reset-password"
                className="text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
              >
                ← Back to OTP verification
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
