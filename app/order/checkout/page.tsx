"use client";

import { useState } from "react";
import Link from "next/link";
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

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleSubmitOrder = async () => {
    setIsProcessing(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems,
          embroideryOptions,
          customerInfo,
          totals,
          artworkFileName,
          specialInstructions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  const totalSavings = volumeDiscount + (artworkSetupWaived ? ARTWORK_SETUP_FEE : 0) + rewardsDiscount;

  return (
    <div className="max-w-3xl mx-auto pb-28 relative z-10 pointer-events-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Checkout</h1>
        <p className="text-white">
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
                <span className="text-2xl font-bold text-white">${orderTotal.toFixed(2)}</span>
              </div>
              {totalSavings > 0 && (
                <p className="text-sm text-green-600 text-right mt-1">
                  🎉 Saving ${totalSavings.toFixed(2)}!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Order Section */}
        <div className="bg-black rounded-xl shadow-sm border border-yellow/30 overflow-hidden">
          <div className="bg-gradient-to-r from-accent to-accent-dark px-6 py-4">
            <h2 className="text-lg font-bold text-black">Submit Order</h2>
          </div>
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <p className="text-white/80 mb-6">
              Review your order details above. Click below to proceed to secure checkout with Stripe.
            </p>

            <button
              type="button"
              onClick={handleSubmitOrder}
              disabled={isProcessing}
              className="relative z-20 w-full inline-flex items-center justify-center gap-2 font-semibold rounded-lg px-6 py-4 text-lg bg-accent hover:bg-accent-dark text-black shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing..." : `Pay Now - $${orderTotal.toFixed(2)}`}
            </button>

            <div className="flex items-center justify-center gap-2 mt-3">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <p className="text-xs text-gray-500">
                Secure payment powered by Stripe
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="pt-4">
          <Link
            href="/order/review"
            className="relative z-20 inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors cursor-pointer"
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
