"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "../../components/Button";
import { useOrder, EXTRA_LOCATION_PRICE, ARTWORK_SETUP_FEE } from "../context/OrderContext";

const frontLocationLabels: Record<string, string> = {
  "front-center": "Center",
  "front-left": "Over Left Eye",
  "front-right": "Over Right Eye",
};

const extraLocationLabels: Record<string, string> = {
  "left-side": "Left Side",
  "right-side": "Right Side",
  "back": "Back",
};

export default function CheckoutPage() {
  const { 
    cartItems, 
    embroideryOptions, 
    artworkFileName, 
    calculateTotals, 
    getTotalHatCount,
    customerInfo,
    specialInstructions,
  } = useOrder();
  const totals = calculateTotals();
  const { 
    hatSubtotal, 
    volumeDiscount, 
    discountedHatSubtotal, 
    extraEmbroideryTotal,
    puffEmbroideryTotal,
    puffPricePerHat,
    artworkSetupFee,
    artworkSetupWaived,
    artworkSetupWaivedReason,
    rewardsDiscount,
    rewardsDiscountPercent,
    orderTotal, 
    discountPerHat 
  } = totals;
  const totalHats = getTotalHatCount();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayNow = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Prepare order data for Stripe
      const orderData = {
        cartItems: cartItems.map(item => ({
          ...item,
          discountPerHat: discountPerHat,
        })),
        embroideryOptions: {
          type: embroideryOptions.type,
          frontLocation: embroideryOptions.frontLocation,
          extraLocations: embroideryOptions.extraLocations,
          artworkSetupFee: artworkSetupFee,
          puffTotal: puffEmbroideryTotal,
          extraTotal: extraEmbroideryTotal,
        },
        customerInfo: customerInfo,
        orderTotal: orderTotal,
        artworkFileName: artworkFileName,
        specialInstructions: specialInstructions || "",
      };

      // Create Stripe checkout session
      const response = await fetch("/api/checkout/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      if (data.sessionId) {
        const { loadStripe } = await import("@stripe/stripe-js");
        const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
        
        if (!publishableKey) {
          throw new Error("Stripe publishable key is not configured");
        }

        const stripe = await loadStripe(publishableKey);
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
          if (error) {
            throw new Error(error.message);
          }
        } else {
          throw new Error("Failed to load Stripe");
        }
      } else {
        throw new Error("No session ID returned");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const totalSavings = volumeDiscount + (artworkSetupWaived ? ARTWORK_SETUP_FEE : 0) + rewardsDiscount;

  return (
    <div className="max-w-3xl mx-auto pb-28">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Checkout</h1>
        <p className="text-gray-600">
          Complete your order. You will be contacted to finalize payment and shipping details.
        </p>
      </div>

      <div className="space-y-6">

        {/* Order Summary */}
        <div className="bg-black rounded-xl shadow-sm border border-yellow/30 overflow-hidden">
          <div className="bg-primary px-6 py-4">
            <h2 className="text-lg font-bold text-yellow">Order Summary</h2>
          </div>

          {/* Cart Items */}
          <div className="divide-y divide-gray-100">
            {cartItems.map((item) => (
              <div key={item.id} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent/10 to-accent-dark/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">{item.name}</p>
                  <p className="text-xs text-yellow/70">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-yellow">
                  ${((item.unitPrice - discountPerHat) * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Embroidery Summary */}
          <div className="border-t border-yellow/30 p-4 bg-black/50">
            <h3 className="font-semibold text-yellow mb-2 text-sm">Embroidery</h3>
            <div className="text-xs text-white/80 space-y-1">
              <p>
                <span className="font-medium">Type:</span>{" "}
                {embroideryOptions.type === "standard" ? "Standard" : "3D Puff"}
              </p>
              <p>
                <span className="font-medium">Front:</span>{" "}
                {frontLocationLabels[embroideryOptions.frontLocation]}
              </p>
              {embroideryOptions.extraLocations.length > 0 && (
                <p>
                  <span className="font-medium">Extra:</span>{" "}
                  {embroideryOptions.extraLocations
                    .map((loc) => extraLocationLabels[loc])
                    .join(", ")}
                </p>
              )}
              {artworkFileName && (
                <p>
                  <span className="font-medium">Artwork:</span> {artworkFileName}
                </p>
              )}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-gray-200 p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Hats ({totalHats})</span>
                <span className={volumeDiscount > 0 ? "text-gray-400 line-through" : "text-text"}>
                  ${hatSubtotal.toFixed(2)}
                </span>
              </div>
              {volumeDiscount > 0 && (
                <>
                  <div className="flex justify-between text-green-600">
                    <span>Volume Discount (${discountPerHat}/hat)</span>
                    <span>-${volumeDiscount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80">Discounted Subtotal</span>
                    <span className="text-white">${discountedHatSubtotal.toFixed(2)}</span>
                  </div>
                </>
              )}
              
              {/* Artwork Setup Fee */}
              <div className="flex justify-between">
                <span className="text-white/80">Artwork Setup</span>
                {artworkSetupWaived ? (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 line-through text-xs">${ARTWORK_SETUP_FEE.toFixed(2)}</span>
                    <span className="text-green-600 font-semibold">
                      FREE {artworkSetupWaivedReason === "existing_logo" ? "(Using Existing Logo)" : "(12+ hats)"}
                    </span>
                  </div>
                ) : (
                  <span className="text-text">${artworkSetupFee.toFixed(2)}</span>
                )}
              </div>
              
              {puffEmbroideryTotal > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    3D Puff (${puffPricePerHat}/hat)
                  </span>
                  <span className="text-text">${puffEmbroideryTotal.toFixed(2)}</span>
                </div>
              )}
              {extraEmbroideryTotal > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Extra Embroidery ({embroideryOptions.extraLocations.length} location{embroideryOptions.extraLocations.length > 1 ? "s" : ""} × ${EXTRA_LOCATION_PRICE}/hat)
                  </span>
                  <span className="text-text">${extraEmbroideryTotal.toFixed(2)}</span>
                </div>
              )}

              {/* Rewards Discount */}
              {rewardsDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Rewards Cash ({rewardsDiscountPercent}%)</span>
                  <span>-${rewardsDiscount.toFixed(2)}</span>
                </div>
              )}
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-text">Total</span>
                <span className="text-2xl font-bold text-primary">${orderTotal.toFixed(2)}</span>
              </div>
              {totalSavings > 0 && (
                <p className="text-sm text-green-600 text-right mt-1">
                  🎉 Saving ${totalSavings.toFixed(2)}!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-black rounded-xl shadow-sm border border-yellow/30 overflow-hidden">
          <div className="bg-gradient-to-r from-accent to-accent-dark px-6 py-4">
            <h2 className="text-lg font-bold text-black">Payment</h2>
          </div>
          <div className="p-6">
            <p className="text-white/80 mb-6">
              Click the button below to securely complete your payment. You&apos;ll be redirected to Stripe Checkout to enter your payment details.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-center">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <Button 
              onClick={handlePayNow} 
              fullWidth 
              className="text-lg py-4"
              disabled={isLoading || cartItems.length === 0}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                `Pay Now - $${orderTotal.toFixed(2)}`
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center mt-3">
              Secure payment powered by Stripe
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="pt-4">
          <Link
            href="/order/review"
            className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Review
          </Link>
        </div>
      </div>
    </div>
  );
}
