"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-primary border-t border-white/10 shadow-lg">
          <div className="flex flex-col py-2">
            <a
              href="#about"
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 text-white/90 hover:bg-white/10 hover:text-accent transition-colors font-medium"
            >
              About Us
            </a>
            <a
              href="#faq"
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 text-white/90 hover:bg-white/10 hover:text-accent transition-colors font-medium"
            >
              FAQ
            </a>
            <Link
              href="/reorder"
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 text-white/90 hover:bg-white/10 hover:text-accent transition-colors font-medium"
            >
              Customer Login
            </Link>
            <div className="border-t border-white/10 mt-2 pt-2">
              <Link
                href="/order/hats"
                onClick={() => setIsOpen(false)}
                className="mx-4 my-2 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-accent hover:bg-accent-dark text-black font-semibold transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Start Your Order
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

