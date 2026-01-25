"use client";

import { useOrder } from "../context/OrderContext";

// Perk thresholds
const FREE_ARTWORK = 12;
const FREE_SHIPPING = 24;
const FREE_PREMIUM = 48;
const MAX_TIER = 188;

// Icons
function ArtworkIcon({ unlocked }: { unlocked: boolean }) {
  return (
    <svg
      className={`w-4 h-4 sm:w-5 sm:h-5 ${unlocked ? "text-white" : "text-white/60"}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

function ShippingIcon({ unlocked }: { unlocked: boolean }) {
  return (
    <svg
      className={`w-4 h-4 sm:w-5 sm:h-5 ${unlocked ? "text-white" : "text-white/60"}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
      />
    </svg>
  );
}

function PremiumIcon({ unlocked }: { unlocked: boolean }) {
  return (
    <svg
      className={`w-4 h-4 sm:w-5 sm:h-5 ${unlocked ? "text-white" : "text-white/60"}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function CartPerksBar() {
  const { cartItems, calculateTotals, getTotalHatCount } = useOrder();

  const totalItems = getTotalHatCount();
  const { orderTotal, volumeDiscount, discountPerHat } = calculateTotals();

  const artworkUnlocked = totalItems >= FREE_ARTWORK;
  const shippingUnlocked = totalItems >= FREE_SHIPPING;
  const premiumUnlocked = totalItems >= FREE_PREMIUM;

  // Calculate progress percentage (0-100) based on items up to MAX_TIER
  const progressPercent = Math.min((totalItems / MAX_TIER) * 100, 100);

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full z-50 text-white shadow-2xl">
      {/* Purple Progress Bar */}
      <div className="bg-primary/90 relative overflow-hidden">
        {/* Animated fill */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-pink via-magenta to-secondary transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
        
        {/* Perks content */}
        <div className="relative flex divide-x divide-white/20">
          {/* Perk 1: Free Artwork Setup at 12+ items */}
          <div
            className={`flex-1 py-2.5 sm:py-3 px-2 flex flex-col items-center justify-center text-center transition-all ${
              artworkUnlocked ? "opacity-100" : "opacity-60"
            }`}
          >
            <div className="flex items-center gap-1 mb-0.5">
              <ArtworkIcon unlocked={artworkUnlocked} />
              {artworkUnlocked && <CheckIcon />}
            </div>
            <p className="font-semibold text-[10px] sm:text-xs">12+ Items</p>
            <p className="text-white/80 text-[9px] sm:text-[10px] hidden sm:block">Free Artwork Setup</p>
          </div>

          {/* Perk 2: Free Shipping at 24+ items */}
          <div
            className={`flex-1 py-2.5 sm:py-3 px-2 flex flex-col items-center justify-center text-center transition-all ${
              shippingUnlocked ? "opacity-100" : "opacity-60"
            }`}
          >
            <div className="flex items-center gap-1 mb-0.5">
              <ShippingIcon unlocked={shippingUnlocked} />
              {shippingUnlocked && <CheckIcon />}
            </div>
            <p className="font-semibold text-[10px] sm:text-xs">24+ Items</p>
            <p className="text-white/80 text-[9px] sm:text-[10px] hidden sm:block">Free Shipping</p>
          </div>

          {/* Perk 3: Free Premium Setup at 48+ items */}
          <div
            className={`flex-1 py-2.5 sm:py-3 px-2 flex flex-col items-center justify-center text-center transition-all ${
              premiumUnlocked ? "opacity-100" : "opacity-60"
            }`}
          >
            <div className="flex items-center gap-1 mb-0.5">
              <PremiumIcon unlocked={premiumUnlocked} />
              {premiumUnlocked && <CheckIcon />}
            </div>
            <p className="font-semibold text-[10px] sm:text-xs">48+ Items</p>
            <p className="text-white/80 text-[9px] sm:text-[10px] hidden sm:block">Free Premium Setup</p>
          </div>
        </div>
      </div>

      {/* Green Total Bar */}
      <div className="bg-green-600 text-center py-2 px-4">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <p className="font-bold text-sm sm:text-base">
            Total: ${orderTotal.toFixed(2)} {!artworkUnlocked && <span className="text-yellow-200">Setup Fee</span>}
          </p>
          <span className="text-white/60">•</span>
          <p className="text-white/90 text-xs sm:text-sm">
            {totalItems} {totalItems === 1 ? "hat" : "hats"}
          </p>
          {volumeDiscount > 0 && (
            <>
              <span className="text-white/60">•</span>
              <p className="text-green-200 text-xs sm:text-sm font-medium">
                Saving ${volumeDiscount.toFixed(2)} (${discountPerHat}/hat)
              </p>
            </>
          )}
          {artworkUnlocked && (
            <>
              <span className="text-white/60">•</span>
              <p className="text-green-200 text-xs sm:text-sm font-medium">
                Setup Fee Waived!
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
