import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getHatById } from "../data";
import HatProductDetailClient from "../HatProductDetailClient";

// Prevent static caching so the page always serves fresh HTML
export const dynamic = "force-dynamic";

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
