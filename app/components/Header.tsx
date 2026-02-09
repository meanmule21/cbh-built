"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import CartIconButton from "./CartIconButton";
import ProductsCartIcon from "./ProductsCartIcon";
import ProductsNavDropdown from "./ProductsNavDropdown";

export default function Header() {
  const pathname = usePathname();
  const isProductsSection = pathname?.startsWith("/products") ?? false;
  return (
    <header className="sticky top-0 z-50 bg-primary shadow-lg">
      {/* Main navigation */}
      <div className="px-2 sm:px-4 py-px">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img 
              src="/mean-mule-logo.png" 
              alt="Mean Mule Apparel Logo - Hard Headed, Hard Working" 
              className="h-16 sm:h-20 object-contain"
            />
          </Link>

          {/* Right side - Navigation + Cart */}
          <div className="flex items-center gap-2 sm:gap-4">
            <ProductsNavDropdown variant="header" />
            <Link
              href="/contact"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="hidden sm:inline">Contact Us</span>
            </Link>
            <Link
              href="/reorder"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden sm:inline">Reorder</span>
            </Link>
            <Link
              href="/order/hats"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-black hover:bg-accent-dark transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">New Order</span>
            </Link>
            {pathname === "/products/hats/injected-camo-trucker" && (
              <Link
                href="/products/cart?add=injected-camo-trucker&name=Injected%20Motorsports%20Old%20School%20Camo%20Duck%20Trucker%20Hat&price=29.99&image=%2Fproducts%2Fhats%2Finjected-camo-trucker-hat.png&category=hats&qty=1"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold text-sm transition-colors"
              >
                <span className="hidden sm:inline">Add to cart</span>
                <span className="sm:hidden">Cart</span>
                <span className="text-xs">$29.99</span>
              </Link>
            )}
            {isProductsSection ? <ProductsCartIcon /> : <CartIconButton />}
          </div>
        </div>
      </div>
    </header>
  );
}
