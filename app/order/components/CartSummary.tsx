"use client";

import { useOrder, ARTWORK_SETUP_FEE, FREE_ARTWORK_THRESHOLD } from "../context/OrderContext";

interface CartSummaryProps {
  showActions?: boolean;
}

export default function CartSummary({ showActions = true }: CartSummaryProps) {
  const { cartItems, embroideryOptions, updateQuantity, removeFromCart, calculateTotals, getTotalHatCount } = useOrder();
  const { 
    hatSubtotal, 
    volumeDiscount, 
    discountedHatSubtotal, 
    discountPerHat,
    puffEmbroideryTotal,
    puffPricePerHat,
    artworkSetupFee,
    artworkSetupWaived,
    orderTotal 
  } = calculateTotals();
  const totalItems = getTotalHatCount();

  if (cartItems.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-text mb-4">Your Cart</h3>
        <div className="text-center py-6">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-7 h-7 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">Your cart is empty</p>
          <p className="text-xs text-gray-400 mt-1">Set hat quantities to get started</p>
        </div>
        
        {/* Show artwork fee even when empty */}
        <div className="border-t border-gray-100 pt-4 mt-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Artwork Setup</span>
            <span className="text-gray-900">${ARTWORK_SETUP_FEE.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Free at {FREE_ARTWORK_THRESHOLD}+ hats</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-primary px-4 py-3">
        <h3 className="text-base font-bold text-white">Your Cart</h3>
        <p className="text-white/70 text-xs">
          {totalItems} {totalItems === 1 ? "hat" : "hats"}
        </p>
      </div>

      <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
        {cartItems.map((item) => (
          <div key={item.id} className="p-3">
            <div className="flex gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-medium text-text text-sm truncate pr-2">{item.name}</p>
                  {showActions && (
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-accent-dark hover:text-accent text-xs flex-shrink-0"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  {showActions ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-text font-medium text-xs"
                      >
                        −
                      </button>
                      <span className="w-6 text-center font-medium text-xs">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-text font-medium text-xs"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-600">Qty: {item.quantity}</span>
                  )}
                  <div className="text-right">
                    {discountPerHat > 0 ? (
                      <p className="font-semibold text-primary text-sm">
                        ${((item.unitPrice - discountPerHat) * item.quantity).toFixed(2)}
                      </p>
                    ) : (
                      <p className="font-semibold text-primary text-sm">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 space-y-2">
        {/* Hat subtotal */}
        {volumeDiscount > 0 ? (
          <>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Hats ({totalItems})</span>
              <span className="line-through">${hatSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-green-600">
              <span>Volume Discount</span>
              <span>-${volumeDiscount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700">Subtotal</span>
              <span className="font-medium">${discountedHatSubtotal.toFixed(2)}</span>
            </div>
          </>
        ) : (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-700">Hats ({totalItems})</span>
            <span className="font-medium">${hatSubtotal.toFixed(2)}</span>
          </div>
        )}

        {/* 3D Puff Embroidery */}
        {embroideryOptions.type === "puff" && totalItems > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-700">3D Puff (${puffPricePerHat}/hat)</span>
            <span className="font-medium">${puffEmbroideryTotal.toFixed(2)}</span>
          </div>
        )}

        {/* Artwork Setup Fee */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-700">Artwork Setup</span>
          {artworkSetupWaived ? (
            <div className="flex items-center gap-2">
              <span className="text-gray-400 line-through text-xs">${ARTWORK_SETUP_FEE.toFixed(2)}</span>
              <span className="text-green-600 font-semibold">FREE</span>
            </div>
          ) : (
            <span className="font-medium">${artworkSetupFee.toFixed(2)}</span>
          )}
        </div>
        {!artworkSetupWaived && totalItems > 0 && (
          <p className="text-xs text-gray-400">
            Add {FREE_ARTWORK_THRESHOLD - totalItems} more for free setup
          </p>
        )}

        {/* Total */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <span className="font-semibold text-text">Total</span>
          <span className="text-lg font-bold text-primary">${orderTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Estimated Delivery - Urgency Element */}
      <div className="bg-green-50 px-4 py-3 border-t border-green-100">
        <div className="flex items-center gap-2 text-green-700">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-xs">
            <p className="font-semibold">Est. Delivery: 10-15 business days</p>
            <p className="text-green-600">Order today, ships soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
