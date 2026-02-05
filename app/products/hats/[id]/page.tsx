import Link from "next/link";

export default function HatProductPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <h1 className="text-2xl font-bold text-white mb-4">Product details</h1>
      <p className="text-white/70 mb-6">
        Full product page for this hat is coming soon. Add your product details, images, and add-to-cart here.
      </p>
      <Link href="/products/hats" className="text-accent hover:text-accent-dark font-medium">
        ← Back to Hats
      </Link>
    </div>
  );
}
