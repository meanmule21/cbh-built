"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProductsCart } from "../context/ProductsCartContext";

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
  const { addItem, items } = useProductsCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const cartItem = items.find((i) => i.id === product.id);
  const inCartQty = cartItem?.quantity ?? 0;

  const handleAdd = () => {
    addItem({
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
    <div className="flex flex-wrap items-center gap-3 mt-6">
      <div className="flex items-center border border-white/20 rounded-lg overflow-hidden bg-black/30">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-3 py-2 text-white hover:bg-white/10 transition-colors"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="px-4 py-2 text-white min-w-[2.5rem] text-center font-medium">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => setQuantity((q) => q + 1)}
          className="px-3 py-2 text-white hover:bg-white/10 transition-colors"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="px-6 py-3 rounded-lg bg-accent hover:bg-accent-dark text-black font-semibold transition-colors shadow-lg"
      >
        {added ? "Added to cart ✓" : "Add to cart"}
      </button>
      {inCartQty > 0 && (
        <button
          type="button"
          onClick={() => router.push("/products/cart")}
          className="text-white/80 hover:text-accent text-sm underline"
        >
          View cart ({inCartQty} {inCartQty === 1 ? "item" : "items"})
        </button>
      )}
    </div>
  );
}
