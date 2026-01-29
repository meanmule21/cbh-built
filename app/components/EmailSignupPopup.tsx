"use client";

import { useState, useEffect } from "react";

export default function EmailSignupPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if already subscribed
    const subscribed = localStorage.getItem("emailSubscribed");
    if (subscribed) return;

    // Check if already shown this session
    const sessionShown = sessionStorage.getItem("emailPopupShown");
    if (sessionShown) return;
    
    // Check if dismissed within last 7 days
    const dismissedAt = localStorage.getItem("emailPopupDismissed");
    if (dismissedAt) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) return;
    }

    // Show after 3 minutes
    const threeMinutes = 3 * 60 * 1000;
    const timer = setTimeout(() => {
      setShowPopup(true);
      sessionStorage.setItem("emailPopupShown", "true");
    }, threeMinutes);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShowPopup(false);
    localStorage.setItem("emailPopupDismissed", Date.now().toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Connect to your email service (Mailchimp, ConvertKit, etc.)
    // For now, simulate a successful submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsLoading(false);
    
    // Store that user subscribed (don't show again)
    localStorage.setItem("emailSubscribed", "true");
    
    // Close after showing success
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Popup */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!isSubmitted ? (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-secondary px-6 py-8 text-center">
              <div className="text-4xl mb-3">🎁</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Get 10% Off Your First Order
              </h2>
              <p className="text-white/80 text-sm">
                Plus exclusive deals & new product updates
              </p>
            </div>

            {/* Form */}
            <div className="px-6 py-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-center"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Subscribing...
                    </span>
                  ) : (
                    "Get My 10% Off Code"
                  )}
                </button>
              </form>

              <button
                onClick={handleClose}
                className="block w-full mt-3 py-2 text-gray-500 hover:text-gray-700 text-center text-sm transition-colors"
              >
                No thanks, I&apos;ll pay full price
              </button>

              {/* Trust text */}
              <p className="text-center text-xs text-gray-400 mt-4">
                🔒 We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </>
        ) : (
          /* Success State */
          <div className="px-6 py-12 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-primary mb-2">
              You&apos;re In!
            </h2>
            <p className="text-gray-600 mb-4">
              Check your email for your discount code:
            </p>
            <div className="bg-gradient-to-r from-accent/10 to-accent-dark/10 border border-accent/20 rounded-xl p-4 mb-4">
              <p className="text-2xl font-bold text-primary tracking-wider">WELCOME10</p>
              <p className="text-accent-dark font-semibold mt-1">10% OFF Your First Order</p>
            </div>
            <p className="text-sm text-gray-500">
              Redirecting you back...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

