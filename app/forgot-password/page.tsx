
"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");
    setSubmitted(false);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            "Unable to process your request. Please try again."
        );
        return;
      }

      setSubmitted(true);
      setMessage(
        data.message ||
          "If an account exists for that email, password reset instructions will be sent."
      );
    } catch {
      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#030303] px-5 py-12 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link
            href="/login"
            aria-label="Edge Portfolio home"
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
          {!submitted ? (
            <>
              <div className="mb-7">
                <h1 className="text-2xl font-semibold text-white">
                  Forgot your password?
                </h1>

                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Enter the email address associated with your
                  Edge Portfolio account. We will check your
                  account and send a six-digit reset code to
                  the registered email address.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-zinc-200"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10"
                  />
                </div>

                {error && (
                  <p
                    className="rounded-lg border border-red-900 bg-red-950/30 p-3 text-sm leading-6 text-red-300"
                    role="alert"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-emerald-500 px-4 py-3 font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Checking account..."
                    : "Continue"}
                </button>
              </form>
            </>
          ) : (
            <div>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xl text-emerald-400">
                ✓
              </div>

              <h1 className="text-2xl font-semibold text-white">
                Check your email
              </h1>

              <p
                className="mt-4 text-sm leading-6 text-emerald-300"
                role="status"
                aria-live="polite"
              >
                {message}
              </p>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Check your inbox and spam folder. If the
                address is registered, you should receive a
                six-digit code that expires in 10 minutes.
              </p>

              <Link
                href={`/reset-password?email=${encodeURIComponent(
                  email.trim().toLowerCase()
                )}`}
                className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-3 font-semibold text-black transition hover:bg-emerald-400"
              >
                Enter reset code
              </Link>
            </div>
          )}

          <div className="mt-7 border-t border-zinc-800 pt-6 text-center">
            <Link
              href="/login"
              className="text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
            >
              ← Back to sign in
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Secure account recovery · Edge Portfolio
        </p>
      </div>
    </main>
  );
}
