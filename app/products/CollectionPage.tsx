"use client";

import { useState } from "react";
import ProductCardWithAdd from "./ProductCardWithAdd";
import { type ProductCardData } from "./ProductCard";

type SortOption = "best-selling" | "price-low" | "price-high" | "name-az" | "name-za";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "best-selling", label: "Best Selling" },
  { value: "price-low", label: "Price, Low to High" },
  { value: "price-high", label: "Price, High to Low" },
  { value: "name-az", label: "Alphabetically, A-Z" },
  { value: "name-za", label: "Alphabetically, Z-A" },
];

export default function CollectionPage({
  title,
  category,
  products,
  filterOptions,
}: {
  title: string;
  category: "hats" | "shirts" | "hoodies";
  products: ProductCardData[];
  filterOptions?: { label: string; options: string[] }[];
}) {
  const [sort, setSort] = useState<SortOption>("best-selling");
  const [showFilters, setShowFilters] = useState(false);

  const sorted = [...products].sort((a, b) => {
    switch (sort) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name-az":
        return a.name.localeCompare(b.name);
      case "name-za":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Title */}
      <h1 className="text-3xl font-bold text-white mb-6">{title}</h1>

      {/* Toolbar: Filters toggle + Sort */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={() => setShowFilters((s) => !s)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 text-white/90 hover:bg-white/10 md:hidden"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filter
        </button>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-white/70 text-sm whitespace-nowrap">Sort by</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="flex-1 md:flex-initial min-w-0 px-3 py-2 rounded-lg bg-black border border-white/20 text-white focus:ring-2 focus:ring-accent focus:border-accent"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters - optional, similar to reference */}
        {filterOptions && filterOptions.length > 0 && (
          <aside
            className={`w-full lg:w-56 flex-shrink-0 space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <h2 className="font-semibold text-white">Filter</h2>
            {filterOptions.map((section) => (
              <div key={section.label}>
                <h3 className="text-sm font-medium text-white/80 mb-2">{section.label}</h3>
                <ul className="space-y-1.5">
                  {section.options.map((opt) => (
                    <li key={opt}>
                      <label className="flex items-center gap-2 text-sm text-white/70 hover:text-white cursor-pointer">
                        <input type="checkbox" className="rounded border-white/30 text-accent focus:ring-accent" />
                        {opt}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <button
              type="button"
              className="text-sm text-accent hover:text-accent-dark"
            >
              Reset filters
            </button>
          </aside>
        )}

        {/* Product grid */}
        <div className="flex-1">
          <p className="text-white/60 text-sm mb-4">
            Showing {sorted.length} of {products.length}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {sorted.map((product) => (
              <ProductCardWithAdd key={product.id} product={product} category={category} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
