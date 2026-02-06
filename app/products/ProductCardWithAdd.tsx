"use client";

import Link from "next/link";
import Image from "next/image";
import { useProductsCart } from "@/app/context/ProductsCartContext";
import type { ProductCardData } from "./ProductCard";

export default function ProductCardWithAdd({
  product,
  category,
}: {
  product: ProductCardData;
  category: "hats" | "shirts" | "hoodies";
}) {
  const cart = useProductsCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    cart?.addItem({
      id: product.id,
      name: product.name,
      unitPrice: product.price,
      image: product.image,
      category,
      quantity: 1,
    });
  };

  return (
    <div className="group block rounded-xl overflow-hidden bg-black border border-yellow/20 hover:border-yellow/50 transition-colors">
      <Link href={`/products/${category}/${product.id}`} className="block">
        <div className="relative aspect-square bg-dark-grey-light">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-white group-hover:text-accent transition-colors line-clamp-2">
            {product.name}
          </h3>
          {product.reviewCount != null && product.reviewCount > 0 && (
            <p className="text-xs text-white/60 mt-1">{product.reviewCount} reviews</p>
          )}
          <p className="mt-2 text-lg font-bold text-accent">${product.price.toFixed(2)}</p>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent-dark text-black font-semibold text-sm transition-colors"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
