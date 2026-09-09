"use client";

import Link from "next/link";
import {
  animate,
  motion,
  useMotionValue,
  type AnimationPlaybackControls,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

/* ============================================================
   TYPES
   ============================================================ */

type Capability = {
  title: string;
  title2: string;
  description: string;
  icon: React.ReactNode;
};

/* ============================================================
   CAPABILITY ICONS
   ============================================================ */

function MarketIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className="h-10 w-10 text-emerald-400"
      aria-hidden="true"
    >
      <circle
        cx="24"
        cy="24"
        r="17"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M10 29 17 22l5 4 10-12 6 5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="17"
        cy="22"
        r="1.8"
        fill="currentColor"
      />
      <circle
        cx="22"
        cy="26"
        r="1.8"
        fill="currentColor"
      />
      <circle
        cx="32"
        cy="14"
        r="1.8"
        fill="currentColor"
      />
    </svg>
  );
}

function TradingToolsIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className="h-10 w-10 text-emerald-400"
      aria-hidden="true"
    >
      <rect
        x="8"
        y="9"
        width="32"
        height="30"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M14 30h4V18h-4v12ZM22 30h4V14h-4v16ZM30 30h4V21h-4v9Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function GlobalMarketsIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className="h-10 w-10 text-emerald-400"
      aria-hidden="true"
    >
      <circle
        cx="24"
        cy="24"
        r="18"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M6 24h36M24 6c5 5 7 11 7 18s-2 13-7 18M24 6c-5 5-7 11-7 18s2 13 7 18"
        stroke="currentColor"
        strokeWidth="1"
        opacity=".75"
      />
      <path
        d="M10 14c4 2 9 3 14 3s10-1 14-3M10 34c4-2 9-3 14-3s10 1 14 3"
        stroke="currentColor"
        strokeWidth="1"
        opacity=".75"
      />
    </svg>
  );
}

function SecurityIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className="h-10 w-10 text-emerald-400"
      aria-hidden="true"
    >
      <rect
        x="10"
        y="21"
        width="28"
        height="21"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M16 21v-7a8 8 0 0 1 16 0v7"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle
        cx="24"
        cy="31"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M24 33.5v4"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function ExecutionIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className="h-10 w-10 text-emerald-400"
      aria-hidden="true"
    >
      <circle
        cx="24"
        cy="24"
        r="18"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M14 29 20 23l5 4 9-11"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M29 16h5v5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ============================================================
   CAPABILITIES DATA
   ============================================================ */

const capabilities: Capability[] = [
  {
    title: "GLOBAL",
    title2: "MARKETS",
    description:
      "Access crypto, forex, and stock markets from one modern platform.",
    icon: <GlobalMarketsIcon />,
  },
  {
    title: "SMART TRADING",
    title2: "TOOLS",
    description:
      "Powerful tools designed to help you analyze markets and trade with confidence.",
    icon: <TradingToolsIcon />,
  },
  {
    title: "MARKET",
    title2: "INSIGHTS",
    description:
      "Stay informed with the market data and insights you need to spot opportunities.",
    icon: <MarketIcon />,
  },
  {
    title: "SECURE",
    title2: "TRADING",
    description:
      "Built with security and reliability at the core of your trading experience.",
    icon: <SecurityIcon />,
  },
  {
    title: "FAST",
    title2: "EXECUTION",
    description:
      "Move from market analysis to action with a streamlined trading experience.",
    icon: <ExecutionIcon />,
  },
];

/* ============================================================
   FANCY CAPABILITY CARD
   ============================================================ */

function CapabilityCard({
  item,
}: {
  item: Capability;
}) {
  return (
    <div className="group relative h-full overflow-hidden border-r border-white/[0.08] px-6 py-7">
      {/* Card atmospheric glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-emerald-500/[0.07] blur-3xl transition-all duration-700 group-hover:bg-emerald-500/[0.14]"
      />

      {/* Emerald accent line */}
      <div
        aria-hidden="true"
        className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/0 to-transparent transition-all duration-700 group-hover:via-emerald-500/70"
      />

      {/* Inner glass highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.035] to-transparent"
      />

      <div className="relative flex min-h-[205px] flex-col">
        {/* Icon frame */}
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.12] via-black/20 to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_30px_rgba(0,0,0,0.25)] transition-all duration-500 group-hover:border-emerald-500/45 group-hover:bg-emerald-500/[0.10] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.10)]">
          {item.icon}
        </div>

        {/* Title */}
        <h3 className="text-[11px] font-bold leading-4 tracking-[0.12em] text-zinc-200 transition-colors duration-300 group-hover:!text-[#FFFFFF]">
          {item.title}
          <br />
          <span className="text-emerald-400/80">{item.title2}</span>
        </h3>

        {/* Description */}
        <p className="mt-3 max-w-[270px] text-sm leading-6 text-zinc-500 transition-colors duration-300 group-hover:!text-[#FFFFFF]">
          {item.description}
        </p>

        {/* Bottom detail */}
        <div className="mt-auto flex items-center gap-2 pt-6">
          <span className="h-px w-6 bg-emerald-500/40 transition-all duration-500 group-hover:w-10 group-hover:bg-emerald-500/70" />
          <span className="text-[8px] uppercase tracking-[0.2em] !text-[#FFFFFF] transition-colors duration-300 group-hover:text-emerald-400/50">
            EDGE PORTFOLIO
          </span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MOBILE CAPABILITIES CAROUSEL
   ============================================================ */

function MobileCapabilitiesCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);

  const animationRef =
    useRef<AnimationPlaybackControls | null>(null);

  const [singleSetWidth, setSingleSetWidth] = useState(0);
  const [maxDrag, setMaxDrag] = useState(0);

  /* ----------------------------------------------------------
     CALCULATE TRACK DIMENSIONS
     ---------------------------------------------------------- */

  useEffect(() => {
    const updateDimensions = () => {
      const container = containerRef.current;
      const track = trackRef.current;

      if (!container || !track) return;

      /*
       * The track contains TWO identical sets of cards.
       *
       * Half of the total track width is therefore the
       * distance required to complete one full cycle.
       */
      const totalWidth = track.scrollWidth;
      const oneSet = totalWidth / 2;

      setSingleSetWidth(oneSet);

      /*
       * Allow manual dragging through one complete set.
       */
      setMaxDrag(oneSet);
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    if (trackRef.current) {
      resizeObserver.observe(trackRef.current);
    }

    window.addEventListener("resize", updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  /* ----------------------------------------------------------
     CONTINUOUS AUTO-SCROLL
     ---------------------------------------------------------- */

  const startAutoScroll = () => {
    if (singleSetWidth <= 0) return;

    animationRef.current?.stop();

    const currentPosition = x.get();

    /*
     * Normalize the current position so that dragging does
     * not cause the animation to suddenly reverse.
     */
    const normalizedPosition =
      ((currentPosition % singleSetWidth) +
        singleSetWidth) %
      singleSetWidth;

    const currentX =
      normalizedPosition === 0
        ? 0
        : -normalizedPosition;

    x.set(currentX);

    const remainingDistance =
      singleSetWidth + currentX;

    /*
     * Constant speed.
     *
     * The entire set takes 42 seconds to travel.
     * When the duplicate set reaches the same visual
     * position, we instantly shift back by one set.
     * Because the content is identical, the user sees
     * absolutely no jump.
     */
    const duration =
      42 * (remainingDistance / singleSetWidth);

    animationRef.current = animate(
      x,
      -singleSetWidth,
      {
        duration: Math.max(4, duration),
        ease: "linear",

        onComplete: () => {
          /*
           * IMPORTANT:
           *
           * We do NOT reset to the beginning of the
           * original array.
           *
           * We move exactly one duplicated set backward.
           * Since the second set is identical to the first,
           * this is visually seamless.
           */
          x.set(0);

          startAutoScroll();
        },
      }
    );
  };

  useEffect(() => {
    if (singleSetWidth <= 0) return;

    startAutoScroll();

    return () => {
      animationRef.current?.stop();
    };
  }, [singleSetWidth]);

  /* ----------------------------------------------------------
     DRAG CONTROLS
     ---------------------------------------------------------- */

  const handleDragStart = () => {
    animationRef.current?.stop();
  };

  const handleDragEnd = () => {
    /*
     * Keep the carousel inside one logical cycle before
     * restarting automatic movement.
     */
    const current = x.get();

    if (current <= -singleSetWidth) {
      x.set(current + singleSetWidth);
    }

    if (current > 0) {
      x.set(current - singleSetWidth);
    }

    startAutoScroll();
  };

  /*
   * Two identical sets create the infinite loop:
   *
   * GLOBAL → TOOLS → INSIGHTS → SECURITY → EXECUTION
   * GLOBAL → TOOLS → INSIGHTS → SECURITY → EXECUTION
   *
   * When the first set finishes, the second set is
   * already entering from the right.
   */
  const loopedCapabilities = [
    ...capabilities,
    ...capabilities,
  ];

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden md:hidden"
    >
      {/* Right atmospheric fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 z-20 h-full w-16 bg-gradient-to-l from-black/70 via-black/20 to-transparent"
      />

      {/* Left atmospheric fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-20 h-full w-8 bg-gradient-to-r from-black/55 to-transparent"
      />

      <motion.div
        ref={trackRef}
        style={{ x }}
        drag="x"
        dragConstraints={{
          left: -maxDrag,
          right: 0,
        }}
        dragElastic={0.06}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className="flex w-max touch-pan-y cursor-grab active:cursor-grabbing"
      >
        {loopedCapabilities.map((item, index) => (
          <div
            key={`${item.title}-${item.title2}-${index}`}
            className="w-[82vw] max-w-[340px] shrink-0"
          >
            <CapabilityCard item={item} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ============================================================
   HERO
   ============================================================ */

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#020604] pt-20">
      {/* =====================================================
          RESPONSIVE BACKGROUND
          ===================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        {/* ---------------------------------------------------
            DESKTOP BACKGROUND
            --------------------------------------------------- */}

        <div
          className="absolute inset-0 hidden bg-cover bg-no-repeat lg:block"
          style={{
            backgroundImage:
              "url('/branding/background.jpg')",
            backgroundPosition: "center 38%",
          }}
        />

        {/* ---------------------------------------------------
            MOBILE BACKGROUND
            --------------------------------------------------- */}

        <div
          className="absolute inset-0 bg-cover bg-no-repeat lg:hidden"
          style={{
            backgroundImage:
              "url('/branding/background-mobile.jpg')",
            backgroundPosition: "center 8%",
          }}
        />

        {/* Deep black readability overlay */}
        <div className="absolute inset-0 bg-black/70" />

        {/* =================================================
            REFINED BLACK + EMERALD ATMOSPHERE
            ================================================= */}

        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_22%,rgba(16,185,129,0.20)_0%,rgba(16,185,129,0.10)_22%,transparent_48%),radial-gradient(ellipse_at_78%_48%,rgba(5,150,105,0.14)_0%,rgba(5,150,105,0.06)_24%,transparent_52%),radial-gradient(ellipse_at_50%_105%,rgba(16,185,129,0.12)_0%,transparent_48%),linear-gradient(135deg,#010403_0%,#03100b_30%,#06150f_52%,#010504_78%,#000000_100%)]"
        />

        {/* Soft emerald light behind the hero content */}
        <div className="absolute left-[20%] top-[25%] h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-emerald-500/[0.06] blur-[140px]" />

        {/* Secondary emerald atmospheric glow */}
        <div className="absolute right-[8%] top-[42%] h-[360px] w-[420px] rounded-full bg-emerald-600/[0.055] blur-[130px]" />

        {/* Emerald lower horizon glow */}
        <div className="absolute -bottom-48 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/[0.045] blur-[150px]" />

        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:60px_60px]" />

        {/* Refined vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(0,0,0,0.22)_58%,rgba(0,0,0,0.72)_100%)]" />

        {/* Bottom fade for smoother transition into the page */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#020604] via-[#020604]/55 to-transparent" />
      </div>

      {/* =====================================================
          HERO CONTENT
          ===================================================== */}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="max-w-2xl pt-5 sm:pt-8 lg:pt-14">
          {/* -------------------------------------------------
              EYEBROW
              ------------------------------------------------- */}

          <div className="flex items-center gap-3">
            <div className="h-px w-10 bg-emerald-500/70" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-400 sm:text-xs">
              Trade smarter. Move with the markets.
            </p>
          </div>

          {/* -------------------------------------------------
              HEADING
              ------------------------------------------------- */}

          <h1 className="mt-5 font-serif text-[3.25rem] font-bold leading-[0.98] tracking-[-0.045em] sm:mt-6 sm:text-6xl lg:text-[5.5rem]">
            <span className="bg-gradient-to-r from-emerald-200 via-emerald-400 to-green-500 bg-clip-text text-transparent">
              Your edge
              <br />
              in global markets.
            </span>
          </h1>

          {/* -------------------------------------------------
              DECORATIVE LINE
              ------------------------------------------------- */}

          <div className="mt-7 flex items-center gap-3 sm:mt-8">
            <div className="h-px w-20 bg-gradient-to-r from-emerald-500/80 to-emerald-500/30 sm:w-32" />

            <span className="relative flex h-3 w-3 shrink-0 items-center justify-center">
              <span className="absolute h-2 w-2 rotate-45 border border-emerald-500/70" />
              <span className="h-1 w-1 rotate-45 bg-emerald-500" />
            </span>

            <div className="h-px w-20 bg-gradient-to-r from-emerald-500/30 to-transparent sm:w-32" />
          </div>

          {/* -------------------------------------------------
              DESCRIPTION
              ------------------------------------------------- */}

          <p className="mt-5 max-w-xl text-sm leading-6 !text-[#FFFFFF] sm:mt-6 sm:text-lg sm:leading-8">
            Edge Portfolio gives you a modern environment to
            access crypto, forex, and stock markets with powerful
            tools built around your trading journey.
          </p>

          {/* -------------------------------------------------
              CTA BUTTONS
              ------------------------------------------------- */}

          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex min-h-[52px] items-center justify-center rounded-md bg-emerald-500 px-7 py-3.5 text-base font-bold !text-black shadow-[0_0_35px_rgba(16,185,129,0.20)] transition hover:bg-emerald-400 hover:shadow-[0_0_40px_rgba(16,185,129,0.30)]"
            >
              Start Trading
            </Link>

            <Link
              href="/markets"
              className="inline-flex min-h-[52px] items-center justify-center rounded-md border border-emerald-500/35 bg-black/20 px-7 py-3.5 text-sm font-bold !text-[#FFFFFF] backdrop-blur-md transition hover:border-emerald-500/60 hover:bg-emerald-500/[0.06]"
            >
              Explore Markets
            </Link>
          </div>

          {/* -------------------------------------------------
              TRUST LINE
              ------------------------------------------------- */}

          <div className="mt-5 flex items-start gap-2 text-xs leading-5 !text-[#FFFFFF] sm:mt-6 sm:items-center sm:text-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400 sm:mt-0"
              aria-hidden="true"
            >
              <path
                d="M12 3 19 6v5c0 4.8-2.9 8.2-7 10-4.1-1.8-7-5.2-7-10V6l7-3Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="m9 12 2 2 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <span>
              Secure Trading. Global Markets. Built for Your Edge.
            </span>
          </div>
        </div>

        {/* ===================================================
            CAPABILITIES PANEL
            =================================================== */}

        <div className="mx-auto mt-16 max-w-6xl sm:mt-20 lg:mt-28">
          <div className="relative overflow-hidden rounded-2xl border border-emerald-500/[0.16] bg-black/45 shadow-[0_25px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
            {/* Outer emerald glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.035]"
            />

            {/* ------------------------------------------------
                MOBILE CAROUSEL
                ------------------------------------------------ */}

            <MobileCapabilitiesCarousel />

            {/* ------------------------------------------------
                DESKTOP GRID
                ------------------------------------------------ */}

            <div className="hidden md:grid md:grid-cols-5">
              {capabilities.map((item, index) => (
                <div
                  key={`${item.title}-${item.title2}`}
                  className="group relative"
                >
                  <CapabilityCard item={item} />

                  {index === capabilities.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute right-0 top-0 h-full w-px bg-transparent"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ------------------------------------------------
              MOBILE SWIPE HINT
              ------------------------------------------------ */}

          <div className="mt-4 flex items-center justify-center gap-2 md:hidden">
            <span className="h-px w-8 bg-emerald-500/30" />

            <span className="text-[9px] uppercase tracking-[0.18em] !text-[#FFFFFF]">
              Swipe to explore
            </span>

            <span className="h-px w-8 bg-emerald-500/30" />
          </div>
        </div>
      </div>
    </section>
  );
}