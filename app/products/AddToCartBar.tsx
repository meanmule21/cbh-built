"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

// Known product IDs and their cart params so Add to cart shows from layout even if page content is cached
const PRODUCT_ADD_LINKS: Record<string, { name: string; price: number; image: string; category: string }> = {
  "injected-camo-trucker": {
    name: "Injected Motorsports Old School Camo Duck Trucker Hat",
    price: 29.99,
    image: "/products/hats/injected-camo-trucker-hat.png",
    category: "hats",
  },
};

function buildAddToCartHref(id: string, name: string, price: number, image: string, category: string) {
  return `/products/cart?add=${encodeURIComponent(id)}&name=${encodeURIComponent(name)}&price=${price}&image=${encodeURIComponent(image)}&category=${category}&qty=1`;
}

export default function AddToCartBar() {
  const pathname = usePathname();
  if (!pathname) return null;

  // Match /products/hats/[id], /products/shirts/[id], /products/hoodies/[id]
  const match = pathname.match(/^\/products\/(hats|shirts|hoodies)\/([^/]+)$/);
  if (!match) return null;
  const category = match[1];
  const id = match[2];
  const product = PRODUCT_ADD_LINKS[id];
  if (!product) return null;

  const href = buildAddToCartHref(id, product.name, product.price, product.image, category);

  return (
    <div className="w-full bg-accent/20 border-y-2 border-accent px-4 py-3">
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-4">
        <Link
          href={href}
          className="inline-block px-8 py-3 rounded-lg bg-accent text-black font-bold text-lg hover:bg-accent-dark transition-colors shadow-lg"
        >
          Add to cart — ${product.price.toFixed(2)}
        </Link>
        <Link href="/products/cart" className="text-white hover:text-accent font-medium underline">
          View cart
        </Link>
      </div>
    </div>
  );
}
