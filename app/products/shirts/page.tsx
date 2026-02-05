import { Metadata } from "next";
import CollectionPage from "../CollectionPage";
import type { ProductCardData } from "../ProductCard";

export const metadata: Metadata = {
  title: "Shirts",
  description: "Shop Mean Mule Apparel shirts. Tees and polos for teams and businesses.",
};

// Placeholder products — replace with your real product data or API
const PLACEHOLDER_SHIRTS: ProductCardData[] = [
  { id: "1", name: "Mean Mule Logo Tee", price: 29.99, image: "/mean-mule-logo.png", reviewCount: 18 },
  { id: "2", name: "Premium Cotton Polo", price: 39.99, image: "/mean-mule-logo.png", reviewCount: 11 },
  { id: "3", name: "Performance Dry-Fit Tee", price: 34.99, image: "/mean-mule-logo.png", reviewCount: 7 },
  { id: "4", name: "V-Neck Soft Tee", price: 26.99, image: "/mean-mule-logo.png", reviewCount: 9 },
  { id: "5", name: "Long Sleeve Work Shirt", price: 44.99, image: "/mean-mule-logo.png", reviewCount: 5 },
  { id: "6", name: "Heather Grey Crewneck", price: 27.99, image: "/mean-mule-logo.png", reviewCount: 14 },
];

const FILTER_OPTIONS = [
  { label: "Product type", options: ["Shirt", "T-Shirt", "Polo"] },
  { label: "Color", options: ["Black", "Navy", "White", "Heather Grey", "Red"] },
  { label: "Size", options: ["S", "M", "L", "XL", "2XL"] },
];

export default function ShirtsPage() {
  return (
    <CollectionPage
      title="Shirts"
      category="shirts"
      products={PLACEHOLDER_SHIRTS}
      filterOptions={FILTER_OPTIONS}
    />
  );
}
