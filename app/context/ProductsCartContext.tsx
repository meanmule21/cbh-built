"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";

export interface ProductsCartItem {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
  image: string;
  category: "hats" | "shirts" | "hoodies";
}

const STORAGE_KEY = "meanmule-products-cart";

function loadCart(): ProductsCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(items: ProductsCartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export type ProductsCartContextType = {
  items: ProductsCartItem[];
  addItem: (item: Omit<ProductsCartItem, "quantity"> & { quantity?: number }) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalCount: number;
  orderTotal: number;
};

const ProductsCartContext = createContext<ProductsCartContextType | undefined>(undefined);

export function ProductsCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ProductsCartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) saveCart(items);
  }, [items, mounted]);

  const addItem = useCallback(
    (item: Omit<ProductsCartItem, "quantity"> & { quantity?: number }) => {
      const qty = Math.max(1, item.quantity ?? 1);
      setItems((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing) {
          return prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + qty } : i
          );
        }
        return [...prev, { ...item, quantity: qty }];
      });
    },
    []
  );

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const orderTotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  return (
    <ProductsCartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalCount,
        orderTotal,
      }}
    >
      {children}
    </ProductsCartContext.Provider>
  );
}

export function useProductsCart(): ProductsCartContextType {
  const ctx = useContext(ProductsCartContext);
  if (ctx === undefined) {
    throw new Error("useProductsCart must be used within ProductsCartProvider");
  }
  return ctx as ProductsCartContextType;
}
