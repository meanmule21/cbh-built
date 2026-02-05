"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const PRODUCT_LINKS = [
  { href: "/products/hats", label: "Hats" },
  { href: "/products/shirts", label: "Shirts" },
  { href: "/products/hoodies", label: "Hoodies" },
] as const;

type Variant = "header" | "homepage";

export default function ProductsNavDropdown({ variant = "header" }: { variant?: Variant }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const baseTrigger =
    variant === "homepage"
      ? "text-white hover:text-yellow transition-colors text-xl font-semibold cursor-pointer flex items-center gap-1"
      : "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        onMouseEnter={variant === "header" ? () => setIsOpen(true) : undefined}
        className={baseTrigger}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Our Products
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            aria-hidden="true"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="absolute left-0 top-full mt-1 z-50 min-w-[160px] rounded-lg bg-primary border border-white/10 shadow-xl py-1"
            onMouseLeave={variant === "header" ? () => setIsOpen(false) : undefined}
          >
            {PRODUCT_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={
                  variant === "homepage"
                    ? "block px-4 py-2.5 text-white/90 hover:bg-white/10 hover:text-yellow transition-colors font-medium"
                    : "block px-4 py-2.5 text-white/90 hover:bg-white/10 hover:text-white transition-colors text-sm"
                }
              >
                {label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
