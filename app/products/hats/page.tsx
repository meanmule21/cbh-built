import { Metadata } from "next";
import CollectionPage from "../CollectionPage";
import { HATS_PRODUCTS } from "./data";

export const metadata: Metadata = {
  title: "Hats",
  description: "Shop Mean Mule Apparel hats. Premium caps and trucker hats for teams and businesses.",
};

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
      products={HATS_PRODUCTS}
      filterOptions={FILTER_OPTIONS}
    />
  );
}
