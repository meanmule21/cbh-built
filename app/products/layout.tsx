import { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AddToCartBar from "./AddToCartBar";

export const metadata: Metadata = {
  title: "Our Products",
  description: "Shop Mean Mule Apparel — Hats, Shirts, and Hoodies. Premium quality for teams and businesses.",
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      <Header />
      <AddToCartBar />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}
