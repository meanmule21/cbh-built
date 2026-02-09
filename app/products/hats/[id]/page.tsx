import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getHatById } from "../data";
import HatProductDetailClient from "../HatProductDetailClient";

export default async function HatProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getHatById(id);
  if (!product) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/products/hats"
        className="inline-flex items-center gap-1 text-white/70 hover:text-accent text-sm mb-8"
      >
        ← Back to Hats
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div className="relative aspect-square rounded-xl overflow-hidden bg-dark-grey-light">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="flex flex-col">
          {/* Add to cart FIRST so it’s always visible above the fold — plain HTML, no JS */}
          <a
            href={`/products/cart?add=${encodeURIComponent(product.id)}&name=${encodeURIComponent(product.name)}&price=${product.price}&image=${encodeURIComponent(product.image)}&category=hats&qty=1`}
            className="w-full block text-center py-4 px-6 rounded-xl bg-accent text-black font-bold text-xl hover:bg-accent-dark transition-colors shadow-lg border-2 border-accent mb-6"
            style={{ display: "block", minHeight: "56px" }}
          >
            Add to cart — ${product.price.toFixed(2)}
          </a>
          <a href="/products/cart" className="text-white/90 hover:text-accent text-sm font-medium underline mb-6 block">
            View cart
          </a>

          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {product.name}
          </h1>
          <p className="text-xl font-bold text-accent mb-6">
            ${product.price.toFixed(2)}
          </p>
          <HatProductDetailClient product={product} />
        </div>
      </div>
    </div>
  );
}
