"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "../../components/Button";
import { useOrder, EXTRA_LOCATION_PRICE, ARTWORK_SETUP_FEE } from "../context/OrderContext";

const frontLocationLabels: Record<string, string> = {
  "front-center": "Front Center",
  "front-left": "Front Left Panel",
  "front-right": "Front Right Panel",
};

const extraLocationLabels: Record<string, string> = {
  "left-side": "Left Side",
  "right-side": "Right Side",
  "back": "Back",
};

export default function CheckoutPage() {
  const { cartItems, embroideryOptions, artworkFileName, calculateTotals, getTotalHatCount } = useOrder();
  const { 
    hatSubtotal, 
    volumeDiscount, 
    discountedHatSubtotal, 
    extraEmbroideryTotal,
    puffEmbroideryTotal,
    puffPricePerHat,
    artworkSetupFee,
    artworkSetupWaived,
    orderTotal, 
    discountPerHat 
  } = calculateTotals();
  const totalHats = getTotalHatCount();

  const [showPaymentMessage, setShowPaymentMessage] = useState(false);

  const handlePayNow = () => {
    setShowPaymentMessage(true);
  };

  return (
    <div className="max-w-3xl mx-auto pb-28">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Checkout</h1>
        <p className="text-gray-600">
          Complete your order. Customer information will be collected by Stripe.
        </p>
      </div>

      <div className="space-y-6">
        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-primary px-6 py-4">
            <h2 className="text-lg font-bold text-white">Order Summary</h2>
          </div>

          {/* Cart Items */}
          <div className="divide-y divide-gray-100">
            {cartItems.map((item) => (
              <div key={item.id} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-royal/10 to-pink/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-text text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-primary">
                  ${((item.unitPrice - discountPerHat) * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Embroidery Summary */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <h3 className="font-semibold text-text mb-2 text-sm">Embroidery</h3>
            <div className="text-xs text-gray-600 space-y-1">
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
                    <span className="text-gray-600">Discounted Subtotal</span>
                    <span className="text-text">${discountedHatSubtotal.toFixed(2)}</span>
                  </div>
                </>
              )}
              
              {/* Artwork Setup Fee */}
              <div className="flex justify-between">
                <span className="text-gray-600">Artwork Setup</span>
                {artworkSetupWaived ? (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 line-through text-xs">${ARTWORK_SETUP_FEE.toFixed(2)}</span>
                    <span className="text-green-600 font-semibold">FREE</span>
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
                    Extra Embroidery
                  </span>
                  <span className="text-text">${extraEmbroideryTotal.toFixed(2)}</span>
                </div>
              )}
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-text">Total</span>
                <span className="text-2xl font-bold text-primary">${orderTotal.toFixed(2)}</span>
              </div>
              {(volumeDiscount > 0 || artworkSetupWaived) && (
                <p className="text-sm text-green-600 text-right mt-1">
                  Saving ${(volumeDiscount + (artworkSetupWaived ? ARTWORK_SETUP_FEE : 0)).toFixed(2)}!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-pink to-magenta px-6 py-4">
            <h2 className="text-lg font-bold text-white">Payment</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-6">
              Click the button below to complete your purchase. You will be redirected to Stripe to securely enter your payment details and shipping information.
            </p>

            {showPaymentMessage ? (
              <div className="bg-royal/10 border border-royal/20 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-royal/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-royal"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">
                  Payment Flow Not Implemented Yet
                </h3>
                <p className="text-secondary">
                  This is where Stripe Checkout will go. The customer&apos;s name, email, and payment details will be collected by Stripe.
                </p>
              </div>
            ) : (
              <Button onClick={handlePayNow} fullWidth className="text-lg py-4">
                Pay Now (Stubbed) - ${orderTotal.toFixed(2)}
              </Button>
            )}
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
