"use client";

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

export default function ReviewPage() {
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

  return (
    <div className="max-w-3xl mx-auto pb-28">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Review Your Order</h1>
        <p className="text-white/80">
          Please review all details before proceeding to checkout.
        </p>
      </div>

      <div className="space-y-6">
        {/* Cart Items */}
        <div className="bg-black rounded-xl shadow-sm border border-yellow/30 overflow-hidden">
          <div className="bg-primary px-6 py-4">
            <h2 className="text-lg font-bold text-white">Hats in Your Order</h2>
            <p className="text-white/70 text-sm">{totalHats} items total</p>
          </div>
          <div className="divide-y divide-white/10">
            {cartItems.map((item) => (
              <div key={item.id} className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent-dark/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-xs text-white/70">
                      {discountPerHat > 0 ? (
                        <>
                          <span className="line-through">${item.unitPrice.toFixed(2)}</span>
                          <span className="text-green-400 ml-1">${(item.unitPrice - discountPerHat).toFixed(2)}</span>
                        </>
                      ) : (
                        <>${item.unitPrice.toFixed(2)}</>
                      )}
                      {" × "}{item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-white">
                  ${((item.unitPrice - discountPerHat) * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Embroidery Details */}
        <div className="bg-black rounded-xl shadow-sm border border-yellow/30 overflow-hidden">
          <div className="bg-secondary px-6 py-4">
            <h2 className="text-lg font-bold text-white">Embroidery Details</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-white/80">Embroidery Type</span>
              <span className="font-medium text-white">
                {embroideryOptions.type === "standard" ? "Standard Embroidery" : "3D Puff Embroidery"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-white/80">Front Location</span>
              <span className="font-medium text-white">
                {frontLocationLabels[embroideryOptions.frontLocation]}
              </span>
            </div>
            <div className="flex justify-between items-start py-2 border-b border-white/10">
              <span className="text-white/80">Extra Locations</span>
              <div className="text-right">
                {embroideryOptions.extraLocations.length > 0 ? (
                  <div className="space-y-1">
                    {embroideryOptions.extraLocations.map((loc) => (
                      <div key={loc} className="flex items-center justify-end gap-2">
                        <span className="font-medium text-white">
                          {extraLocationLabels[loc]}
                        </span>
                        <span className="text-accent text-sm">
                          (+${EXTRA_LOCATION_PRICE}/hat)
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-white/60">None selected</span>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-white/80">Artwork File</span>
              <span className="font-medium text-white truncate max-w-[200px]">
                {artworkFileName || "No file uploaded"}
              </span>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-black rounded-xl shadow-sm border border-yellow/30 overflow-hidden">
          <div className="bg-gradient-to-r from-accent to-accent-dark px-6 py-4">
            <h2 className="text-lg font-bold text-black">Price Breakdown</h2>
          </div>
          <div className="p-6 space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-white/80">Hat Subtotal ({totalHats} hats)</span>
              <span className={`font-medium ${volumeDiscount > 0 ? "text-white/50 line-through" : "text-white"}`}>
                ${hatSubtotal.toFixed(2)}
              </span>
            </div>
            {volumeDiscount > 0 && (
              <>
                <div className="flex justify-between items-center py-2 text-green-400">
                  <div>
                    <span>Volume Discount</span>
                    <p className="text-xs text-green-400/80">
                      ${discountPerHat} off × {totalHats} hats
                    </p>
                  </div>
                  <span className="font-medium">-${volumeDiscount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-white/80">Discounted Subtotal</span>
                  <span className="font-medium text-white">${discountedHatSubtotal.toFixed(2)}</span>
                </div>
              </>
            )}
            
            {/* Artwork Setup Fee */}
            <div className="flex justify-between items-center py-2">
              <span className="text-white/80">Artwork Setup</span>
              {artworkSetupWaived ? (
                <div className="flex items-center gap-2">
                  <span className="text-white/50 line-through">${ARTWORK_SETUP_FEE.toFixed(2)}</span>
                  <span className="text-green-400 font-semibold">FREE</span>
                </div>
              ) : (
                <span className="font-medium text-white">${artworkSetupFee.toFixed(2)}</span>
              )}
            </div>
            
            {puffEmbroideryTotal > 0 && (
              <div className="flex justify-between items-center py-2">
                <div>
                  <span className="text-white/80">3D Puff Embroidery</span>
                  <p className="text-xs text-white/60">
                    ${puffPricePerHat}/hat × {totalHats} hats
                  </p>
                </div>
                <span className="font-medium text-white">${puffEmbroideryTotal.toFixed(2)}</span>
              </div>
            )}
            {extraEmbroideryTotal > 0 && (
              <div className="flex justify-between items-center py-2">
                <div>
                  <span className="text-white/80">Extra Embroidery</span>
                  <p className="text-xs text-white/60">
                    {embroideryOptions.extraLocations.length} location(s) × {totalHats} hats × ${EXTRA_LOCATION_PRICE}
                  </p>
                </div>
                <span className="font-medium text-white">${extraEmbroideryTotal.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-white/10 pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-white">Order Total</span>
                <span className="text-2xl font-bold text-accent">${orderTotal.toFixed(2)}</span>
              </div>
              {(volumeDiscount > 0 || artworkSetupWaived) && (
                <p className="text-sm text-green-400 text-right mt-1">
                  You&apos;re saving ${(volumeDiscount + (artworkSetupWaived ? ARTWORK_SETUP_FEE : 0)).toFixed(2)}!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Delivery Estimate - Urgency */}
        <div className="bg-black rounded-xl border border-yellow/30 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-white">Estimated Delivery: 10-15 Business Days</p>
              <p className="text-sm text-white/70">Complete checkout today and your hats ship soon!</p>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button href="/order/artwork" variant="outline" className="flex-1">
            ← Back to Artwork
          </Button>
          <Button href="/order/checkout" className="flex-1">
            Proceed to Checkout →
          </Button>
        </div>
      </div>
    </div>
  );
}
