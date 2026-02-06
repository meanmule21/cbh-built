import { Metadata } from "next";
import CollectionPage from "../CollectionPage";
import type { ProductCardData } from "../ProductCard";

export const metadata: Metadata = {
  title: "Hats",
  description: "Shop Mean Mule Apparel hats. Premium caps and trucker hats for teams and businesses.",
};

// Placeholder products — replace with your real product data or API
const PLACEHOLDER_HATS: ProductCardData[] = [
  {
    id: "injected-camo-trucker",
    name: "Injected Motorsports Old School Camo Duck Trucker Hat",
    price: 29.99,
    image: "/products/hats/injected-camo-trucker-hat.png",
    reviewCount: 0,
  },
  { id: "1", name: "Mean Mule Trucker Hat", price: 24.99, image: "/mean-mule-logo.png", reviewCount: 12 },
  { id: "2", name: "Classic Snapback Cap", price: 22.99, image: "/mean-mule-logo.png", reviewCount: 8 },
  { id: "3", name: "Structured Dad Cap", price: 26.99, image: "/mean-mule-logo.png", reviewCount: 15 },
  { id: "4", name: "Low Profile Embroidered Hat", price: 23.99, image: "/mean-mule-logo.png", reviewCount: 6 },
  { id: "5", name: "Mesh Back Trucker", price: 21.99, image: "/mean-mule-logo.png", reviewCount: 22 },
  { id: "6", name: "Washed Cotton Cap", price: 25.99, image: "/mean-mule-logo.png", reviewCount: 4 },
];

const FILTER_OPTIONS = [
  { label: "Product type", options: ["Hat"] },
  { label: "Color", options: ["Black", "Navy", "Charcoal", "White", "Khaki"] },
  { label: "Size", options: ["One Size", "S/M", "L/XL"] },
];

export default function HatsPage() {
  return (
    <CollectionPage
      title="Hats"
      category="hats"
      products={PLACEHOLDER_HATS}
      filterOptions={FILTER_OPTIONS}
    />
  );
}
