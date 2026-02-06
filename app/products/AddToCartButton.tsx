"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProductsCart } from "@/app/context/ProductsCartContext";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  category: "hats" | "shirts" | "hoodies";
}

export default function AddToCartButton({ product, category }: AddToCartButtonProps) {
  const cart = useProductsCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const items = cart?.items ?? [];
  const cartItem = items.find((i) => i.id === product.id);
  const inCartQty = cartItem?.quantity ?? 0;

  const handleAdd = () => {
    if (!cart) return;
    cart.addItem({
      id: product.id,
      name: product.name,
      unitPrice: product.price,
      image: product.image,
      category,
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      className="flex flex-wrap items-center gap-4 mt-6 p-4 rounded-xl border-2 border-accent/50 bg-black/40"
      data-testid="add-to-cart-section"
    >
      <span className="w-full text-sm font-semibold text-white/90 uppercase tracking-wide">
        Quantity
      </span>
      <div className="flex items-center border border-white/30 rounded-lg overflow-hidden bg-black/50">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-4 py-3 text-white hover:bg-white/10 transition-colors"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="px-5 py-3 text-white min-w-[3rem] text-center font-bold text-lg">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => setQuantity((q) => q + 1)}
          className="px-4 py-3 text-white hover:bg-white/10 transition-colors"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="px-8 py-4 rounded-lg bg-accent hover:bg-accent-dark text-black font-bold text-lg transition-colors shadow-lg border-2 border-accent"
      >
        {added ? "Added to cart ✓" : "Add to cart"}
      </button>
      {inCartQty > 0 && (
        <button
          type="button"
          onClick={() => router.push("/products/cart")}
          className="text-white hover:text-accent text-sm font-medium underline"
        >
          View cart ({inCartQty} {inCartQty === 1 ? "item" : "items"})
        </button>
      )}
    </div>
  );
}
