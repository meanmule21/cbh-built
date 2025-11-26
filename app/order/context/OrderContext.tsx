"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

// Types
export interface CartItem {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

export type EmbroideryType = "standard" | "puff";
export type FrontLocation = "front-center" | "front-left" | "front-right";
export type ExtraLocation = "left-side" | "right-side" | "back";

export interface EmbroideryOptions {
  type: EmbroideryType;
  frontLocation: FrontLocation;
  extraLocations: ExtraLocation[];
  artworkRightsConfirmed: boolean;
}

export interface OrderTotals {
  hatSubtotal: number;           // Before volume discount
  volumeDiscount: number;        // Total discount from volume pricing
  discountedHatSubtotal: number; // After volume discount
  extraEmbroideryTotal: number;
  puffEmbroideryTotal: number;   // 3D puff cost (0 if standard)
  puffPricePerHat: number;       // Current 3D puff price per hat
  artworkSetupFee: number;       // $40 or $0 if 12+ items
  artworkSetupWaived: boolean;   // true if 12+ items
  orderTotal: number;            // Final total
  discountPerHat: number;        // Current discount per hat
}

interface OrderContextType {
  cartItems: CartItem[];
  embroideryOptions: EmbroideryOptions;
  artworkFile: File | null;
  artworkFileName: string | null;
  additionalFile: File | null;
  additionalFileName: string | null;
  specialInstructions: string;
  addToCart: (hat: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  updateQuantity: (hatId: string, newQty: number) => void;
  removeFromCart: (hatId: string) => void;
  setEmbroideryOptions: (options: Partial<EmbroideryOptions>) => void;
  setArtworkFile: (file: File | null) => void;
  setAdditionalFile: (file: File | null) => void;
  setSpecialInstructions: (instructions: string) => void;
  calculateTotals: () => OrderTotals;
  getTotalHatCount: () => number;
  getDiscountPerHat: (totalItems: number) => number;
}

const defaultEmbroideryOptions: EmbroideryOptions = {
  type: "standard",
  frontLocation: "front-center",
  extraLocations: [],
  artworkRightsConfirmed: false,
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const EXTRA_LOCATION_PRICE = 5; // $5 per hat per extra location
export const ARTWORK_SETUP_FEE = 40;   // $40 artwork setup fee
export const FREE_ARTWORK_THRESHOLD = 12; // Free at 12+ items

// Volume-based price breaks
// 12+ items → Free Artwork Setup (no price drop)
// 24+ items → $1 off per hat
// 48+ items → $2 off per hat
// 96+ items → $3 off per hat
// 188+ items → $4 off per hat
export function getDiscountPerHat(totalItems: number): number {
  if (totalItems >= 188) return 4;
  if (totalItems >= 96) return 3;
  if (totalItems >= 48) return 2;
  if (totalItems >= 24) return 1;
  return 0;
}

// 3D Puff embroidery pricing per hat
// Base: $7/hat, volume discounts apply
export function get3DPuffPricePerHat(totalItems: number): number {
  if (totalItems >= 188) return 2;
  if (totalItems >= 96) return 3;
  if (totalItems >= 48) return 4;
  if (totalItems >= 24) return 5;
  if (totalItems >= 12) return 6;
  return 7;
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [embroideryOptions, setEmbroideryOptionsState] = useState<EmbroideryOptions>(defaultEmbroideryOptions);
  const [artworkFile, setArtworkFileState] = useState<File | null>(null);
  const [artworkFileName, setArtworkFileName] = useState<string | null>(null);
  const [additionalFile, setAdditionalFileState] = useState<File | null>(null);
  const [additionalFileName, setAdditionalFileName] = useState<string | null>(null);
  const [specialInstructions, setSpecialInstructionsState] = useState<string>("");

  const addToCart = useCallback((hat: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    const quantity = hat.quantity || 1;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === hat.id);
      if (existing) {
        return prev.map((item) =>
          item.id === hat.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...hat, quantity }];
    });
  }, []);

  const updateQuantity = useCallback((hatId: string, newQty: number) => {
    if (newQty <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== hatId));
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === hatId ? { ...item, quantity: newQty } : item))
      );
    }
  }, []);

  const removeFromCart = useCallback((hatId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== hatId));
  }, []);

  const setEmbroideryOptions = useCallback((options: Partial<EmbroideryOptions>) => {
    setEmbroideryOptionsState((prev) => ({ ...prev, ...options }));
  }, []);

  const setArtworkFile = useCallback((file: File | null) => {
    setArtworkFileState(file);
    setArtworkFileName(file ? file.name : null);
  }, []);

  const setAdditionalFile = useCallback((file: File | null) => {
    setAdditionalFileState(file);
    setAdditionalFileName(file ? file.name : null);
  }, []);

  const setSpecialInstructions = useCallback((instructions: string) => {
    setSpecialInstructionsState(instructions);
  }, []);

  const getTotalHatCount = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const calculateTotals = useCallback((): OrderTotals => {
    // Calculate hat subtotal at full price (before discount)
    const hatSubtotal = cartItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );

    // Get total items and calculate volume discount
    const totalHats = getTotalHatCount();
    const discountPerHat = getDiscountPerHat(totalHats);
    
    // Total volume discount = discount per hat × total hats
    const volumeDiscount = discountPerHat * totalHats;
    
    // Discounted hat subtotal
    const discountedHatSubtotal = hatSubtotal - volumeDiscount;

    // Extra embroidery charges
    const extraLocationCount = embroideryOptions.extraLocations.length;
    const extraEmbroideryTotal = totalHats * extraLocationCount * EXTRA_LOCATION_PRICE;

    // 3D Puff embroidery charges (only if puff type selected)
    const puffPricePerHat = get3DPuffPricePerHat(totalHats);
    const puffEmbroideryTotal = embroideryOptions.type === "puff" ? puffPricePerHat * totalHats : 0;

    // Artwork setup fee - FREE at 12+ items
    const artworkSetupWaived = totalHats >= FREE_ARTWORK_THRESHOLD;
    const artworkSetupFee = artworkSetupWaived ? 0 : ARTWORK_SETUP_FEE;

    // Final order total
    const orderTotal = discountedHatSubtotal + extraEmbroideryTotal + puffEmbroideryTotal + artworkSetupFee;

    return {
      hatSubtotal,
      volumeDiscount,
      discountedHatSubtotal,
      extraEmbroideryTotal,
      puffEmbroideryTotal,
      puffPricePerHat,
      artworkSetupFee,
      artworkSetupWaived,
      orderTotal,
      discountPerHat,
    };
  }, [cartItems, embroideryOptions.extraLocations, embroideryOptions.type, getTotalHatCount]);

  return (
    <OrderContext.Provider
      value={{
        cartItems,
        embroideryOptions,
        artworkFile,
        artworkFileName,
        additionalFile,
        additionalFileName,
        specialInstructions,
        addToCart,
        updateQuantity,
        removeFromCart,
        setEmbroideryOptions,
        setArtworkFile,
        setAdditionalFile,
        setSpecialInstructions,
        calculateTotals,
        getTotalHatCount,
        getDiscountPerHat,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
}
