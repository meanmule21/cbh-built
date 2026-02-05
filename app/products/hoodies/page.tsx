import { Metadata } from "next";
import CollectionPage from "../CollectionPage";
import type { ProductCardData } from "../ProductCard";

export const metadata: Metadata = {
  title: "Hoodies",
  description: "Shop Mean Mule Apparel hoodies and pullovers. Comfortable gear for teams and businesses.",
};

// Placeholder products — replace with your real product data or API
const PLACEHOLDER_HOODIES: ProductCardData[] = [
  { id: "1", name: "Mean Mule Pullover Hoodie", price: 49.99, image: "/mean-mule-logo.png", reviewCount: 20 },
  { id: "2", name: "Zip-Up Performance Hoodie", price: 54.99, image: "/mean-mule-logo.png", reviewCount: 13 },
  { id: "3", name: "Heavyweight Crewneck Sweatshirt", price: 44.99, image: "/mean-mule-logo.png", reviewCount: 6 },
  { id: "4", name: "Lightweight French Terry Hoodie", price: 42.99, image: "/mean-mule-logo.png", reviewCount: 10 },
  { id: "5", name: "Full Zip Fleece", price: 52.99, image: "/mean-mule-logo.png", reviewCount: 8 },
  { id: "6", name: "Embroidered Logo Hoodie", price: 47.99, image: "/mean-mule-logo.png", reviewCount: 16 },
];

const FILTER_OPTIONS = [
  { label: "Product type", options: ["Hoodie", "Pullover", "Zip-Up"] },
  { label: "Color", options: ["Black", "Navy", "Charcoal", "Heather Grey", "Burgundy"] },
  { label: "Size", options: ["S", "M", "L", "XL", "2XL"] },
];

export default function HoodiesPage() {
  return (
    <CollectionPage
      title="Hoodies"
      category="hoodies"
      products={PLACEHOLDER_HOODIES}
      filterOptions={FILTER_OPTIONS}
    />
  );
}
