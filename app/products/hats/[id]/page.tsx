import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getHatById } from "../data";

export default async function HatProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getHatById(id);
  if (!product) notFound();

  const paragraphs = product.description
    ? product.description.trim().split(/\n\n+/)
    : [];

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

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {product.name}
          </h1>
          <p className="text-xl font-bold text-accent mb-6">
            ${product.price.toFixed(2)}
          </p>

          {product.description ? (
            <div className="text-white/90 space-y-4 prose prose-invert prose-p:text-white/90 prose-li:text-white/90 prose-strong:text-white max-w-none">
              {paragraphs.map((block, i) => {
                const trimmed = block.trim();
                if (!trimmed) return null;
                // Bold line (e.g. **Details:**)
                if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
                  return (
                    <h3 key={i} className="font-semibold text-white mt-6 mb-2">
                      {trimmed.replace(/\*\*/g, "")}
                    </h3>
                  );
                }
                // Bullet list
                if (trimmed.startsWith("•")) {
                  const items = trimmed.split("\n").filter((l) => l.trim());
                  return (
                    <ul key={i} className="list-none space-y-1 pl-0">
                      {items.map((line, j) => (
                        <li key={j} className="flex gap-2">
                          <span className="text-accent">•</span>
                          <span>{line.replace(/^•\s*/, "").trim()}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                // Italic line
                if (trimmed.startsWith("*") && trimmed.endsWith("*")) {
                  return (
                    <p key={i} className="italic text-white/80">
                      {trimmed.replace(/\*/g, "").trim()}
                    </p>
                  );
                }
                return (
                  <p key={i} className="leading-relaxed">
                    {trimmed.replace(/\*\*(.+?)\*\*/g, "$1")}
                  </p>
                );
              })}
            </div>
          ) : (
            <p className="text-white/70">
              Product details coming soon.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
