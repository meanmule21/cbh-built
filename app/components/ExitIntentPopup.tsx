"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ExitIntentPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if already shown this session
    const alreadyShown = sessionStorage.getItem("exitPopupShown");
    if (alreadyShown) {
      setHasShown(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves from top of page
      if (e.clientY <= 0 && !hasShown) {
        setShowPopup(true);
        setHasShown(true);
        sessionStorage.setItem("exitPopupShown", "true");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShown]);

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setShowPopup(false)}
      />
      
      {/* Popup */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={() => setShowPopup(false)}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary px-6 py-8 text-center">
          <div className="text-4xl mb-2">🎩</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Wait! Don&apos;t Leave Empty-Handed
          </h2>
          <p className="text-white/80">
            Get a special deal on your first order
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="bg-gradient-to-r from-accent/10 to-accent-dark/10 border border-accent/20 rounded-xl p-4 mb-6 text-center">
            <p className="text-sm text-gray-600 mb-1">Use code at checkout:</p>
            <p className="text-2xl font-bold text-primary tracking-wider">WELCOME10</p>
            <p className="text-accent-dark font-semibold mt-1">10% OFF Your First Order</p>
          </div>

          <div className="space-y-3">
            <Link
              href="/order/hats"
              onClick={() => setShowPopup(false)}
              className="block w-full py-3 px-4 bg-accent hover:bg-accent-dark text-white text-center font-semibold rounded-lg transition-colors"
            >
              Claim My Discount
            </Link>
            <button
              onClick={() => setShowPopup(false)}
              className="block w-full py-2 px-4 text-gray-500 hover:text-gray-700 text-center text-sm transition-colors"
            >
              No thanks, I&apos;ll pay full price
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Free Shipping 24+
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              No Minimums
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

