"use client";

import Link from "next/link";
import CartIconButton from "./CartIconButton";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-primary shadow-lg">
      {/* Main navigation */}
      <div className="px-2 sm:px-4 py-px">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img 
              src="/cbh-logo-dark.png.jpg" 
              alt="Custom Business Hats Logo - Order Custom Embroidered Hats" 
              className="h-16 sm:h-20 object-contain"
            />
          </Link>

          {/* Right side - Navigation + Cart */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/reorder"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">Reorder</span>
            </Link>
            <Link
              href="/order/hats"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-white hover:bg-accent-dark transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">New Order</span>
            </Link>
            <CartIconButton />
          </div>
        </div>
      </div>
    </header>
  );
}
