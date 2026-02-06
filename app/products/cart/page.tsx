"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useProductsCart } from "../../context/ProductsCartContext";

export default function ProductsCartPage() {
  const { items, updateQuantity, removeItem, orderTotal, totalCount } = useProductsCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsCheckingOut(true);
    setError("");
    try {
      const cartItems = items.map((i) => ({
        name: i.name,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
      }));
      const orderTotalCents = Math.round(orderTotal * 100);
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems,
          embroideryOptions: { type: "standard", frontLocation: "front-center", extraLocations: [], artworkRightsConfirmed: true },
          customerInfo: null,
          totals: {
            orderTotal,
            discountPerHat: 0,
            hatSubtotal: orderTotal,
            volumeDiscount: 0,
            discountedHatSubtotal: orderTotal,
            extraEmbroideryTotal: 0,
            puffEmbroideryTotal: 0,
            puffPricePerHat: 0,
            artworkSetupFee: 0,
            artworkSetupWaived: true,
            artworkSetupWaivedReason: null,
            rewardsDiscount: 0,
            rewardsDiscountPercent: 0,
            discountPerHat: 0,
          },
          artworkFileName: "",
          specialInstructions: "",
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Checkout failed");
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error("No checkout URL received");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Your cart is empty</h1>
        <p className="text-white/70 mb-8">Add some products from our shop to get started.</p>
        <Link
          href="/products/hats"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-black font-semibold hover:bg-accent-dark transition-colors"
        >
          Shop Hats
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Cart ({totalCount} {totalCount === 1 ? "item" : "items"})</h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 p-4 rounded-xl bg-black border border-yellow/20"
          >
            <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-dark-grey-light">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-contain p-1"
                sizes="80px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">{item.name}</p>
              <p className="text-accent font-medium">${item.unitPrice.toFixed(2)} each</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 flex items-center justify-center rounded bg-white/10 text-white hover:bg-white/20"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-8 text-center text-white font-medium">{item.quantity}</span>
              <button
                type="button"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center rounded bg-white/10 text-white hover:bg-white/20"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <p className="text-white font-semibold w-20 text-right">
              ${(item.unitPrice * item.quantity).toFixed(2)}
            </p>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="p-2 text-white/60 hover:text-red-400 transition-colors"
              aria-label="Remove from cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-white/20 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-xl font-bold text-white">
          Total: <span className="text-accent">${orderTotal.toFixed(2)}</span>
        </p>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="button"
          onClick={handleCheckout}
          disabled={isCheckingOut}
          className="w-full sm:w-auto px-8 py-3 rounded-lg bg-accent hover:bg-accent-dark text-black font-semibold disabled:opacity-50 transition-colors"
        >
          {isCheckingOut ? "Redirecting to checkout…" : "Proceed to checkout"}
        </button>
      </div>

      <p className="mt-6 text-center">
        <Link href="/products/hats" className="text-white/70 hover:text-accent text-sm">
          ← Continue shopping
        </Link>
      </p>
    </div>
  );
}
