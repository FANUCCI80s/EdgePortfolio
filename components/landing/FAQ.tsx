
"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What is EDGE PORTFOLIO?",
    answer: (
      <>
        <p>
          EDGE PORTFOLIO is a digital trading platform designed to give users
          access to global financial markets through a secure and intuitive
          trading environment. The platform allows users to manage their
          trading account, monitor market prices, and access supported
          cryptocurrencies, stocks, forex pairs, and other available markets.
        </p>

        <p className="mt-4">
          EDGE PORTFOLIO is built to provide a straightforward trading
          experience with real-time market information, account management
          tools, secure transactions, and access to a range of supported
          financial markets.
        </p>
      </>
    ),
  },
  {
    question: "How do I create an account?",
    answer: (
      <p>
        Select <strong>Sign Up</strong> or <strong>Get Started</strong> and
        provide the required account information to create your Edge Portfolio
        account. Follow the verification steps provided during registration
        and complete any required identity verification before accessing
        features that require a verified account.
      </p>
    ),
  },
  {
    question: "Do I need to complete KYC?",
    answer: (
      <p>
        Yes.{" "}
        <strong>KYC (Know Your Customer) verification may be required</strong>{" "}
        before you can access certain account features. KYC helps verify your
        identity, protect accounts from unauthorized activity, reduce fraud,
        and support applicable compliance requirements. If verification is
        required for your account, you can complete the process through your
        account profile.
      </p>
    ),
  },
  {
    question: "What markets can I trade?",
    answer: (
      <>
        <p>
          EDGE PORTFOLIO provides access to multiple financial markets,
          allowing users to monitor and trade supported assets across
          different market categories. Available markets may include
          <strong> cryptocurrencies, stocks, forex, ETFs, bonds,
          precious metals, and commodities</strong>.
        </p>

        <p className="mt-4">
          The available assets and market information are displayed on the
          <strong> Markets</strong> page and may change as supported markets
          are added or updated.
        </p>
      </>
    ),
  },
  {
    question: "How can I deposit funds?",
    answer: (
      <>
        <p>
          To deposit funds, log in to your Edge Portfolio account and navigate
          to the <strong>Deposit</strong> section. Select an available deposit
          method, choose the supported cryptocurrency and network, and enter
          the amount you wish to deposit.
        </p>

        <p className="mt-4">
          Follow the payment instructions provided for your selected deposit
          method. Where required, submit your payment receipt or proof of
          payment and mark the deposit as paid. Your deposit will remain
          pending until it has been reviewed and approved.
        </p>
      </>
    ),
  },
  {
    question: "How long does a deposit take?",
    answer: (
      <>
        <p>
          Deposit processing times can vary depending on the selected
          cryptocurrency, blockchain network, deposit method, and verification
          process. After you submit your deposit request and any required
          payment proof, the request may need to be reviewed before your
          trading balance is updated.
        </p>

        <p className="mt-4">
          You can monitor the status of your deposit from your Edge Portfolio
          account. Once the deposit has been successfully verified and
          approved, the corresponding funds will be reflected in your account
          balance.
        </p>
      </>
    ),
  },
  {
    question: "How do withdrawals work?",
    answer: (
      <>
        <p>
          To make a <strong>withdrawal</strong>, log in to your Edge Portfolio
          account and navigate to the <strong>Withdrawal</strong> section.
          Enter the amount you wish to withdraw, select the available
          cryptocurrency and network, and provide the destination wallet
          address.
        </p>

        <p className="mt-4">
          After submitting your withdrawal request, it will be reviewed before
          processing. You can monitor the status of your request from your
          account, and approved withdrawals will be sent to the wallet address
          you provided.
        </p>
      </>
    ),
  },
  {
    question: "Is my trading account protected?",
    answer: (
      <>
        <p>
          Edge Portfolio uses security and verification measures designed to
          help protect your trading account, personal information, and account
          transactions. Security controls are applied throughout the platform
          to help maintain a secure trading environment.
        </p>

        <p className="mt-4">
          You should also protect your account by using a strong and unique
          password, keeping your login credentials private, and completing any
          required verification steps. Never share your password or
          verification codes with anyone.
        </p>
      </>
    ),
  },
  {
    question: "How can I monitor the markets?",
    answer: (
      <p>
        You can monitor supported market prices and price movements through
        the <strong>Markets</strong> section of Edge Portfolio. Market
        information may include cryptocurrencies, stocks, forex pairs, and
        other supported asset classes. Market prices and changes are updated
        using the available market data sources connected to the platform.
      </p>
    ),
  },
  {
    question: "Can I track my trading activity?",
    answer: (
      <p>
        Yes. Your Edge Portfolio account provides access to your account
        activity and transaction information. You can review relevant
        deposits, withdrawals, trading-related transactions, and other
        supported account activity from the appropriate sections of your
        dashboard.
      </p>
    ),
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative overflow-hidden border-t border-white/5 bg-[#050505] py-24 sm:py-28"
    >
      {/* Background image */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage:
            "url('/branding/new-background-mobile-1.jpg')",
        }}
      />

      {/* Dark overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[#050505]/85" />

      {/* Cinematic gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#050505]/95 via-transparent to-[#050505]/95" />

      {/* Emerald ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
            FAQ
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight !text-[#FFFFFF] sm:text-4xl lg:text-5xl">
            Frequently asked questions
          </h2>

          <p className="mt-5 text-base leading-7 !text-[#FFFFFF] sm:text-lg">
            Find answers to some of the most common questions about Edge
            Portfolio.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="mt-14 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className={`overflow-hidden rounded-2xl border backdrop-blur-md transition duration-300 ${
                  isOpen
                    ? "border-emerald-500/20 bg-black/50"
                    : "border-white/10 bg-black/35 hover:border-white/15 hover:bg-black/45"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
                >
                  <span className="text-sm font-bold !text-[#FFFFFF] sm:text-base">
                    {faq.question}
                  </span>

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-lg transition duration-300 ${
                      isOpen
                        ? "rotate-45 border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border-white/10 bg-white/5 text-gray-400"
                    }`}
                  >
                    +
                  </span>
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-300 ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 text-sm leading-7 !text-[#FFFFFF] sm:text-base">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

