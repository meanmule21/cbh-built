"use client";

import AddToCartButton from "@/app/products/AddToCartButton";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string | null;
};

type Block = { type: "heading"; text: string } | { type: "bullets"; items: string[] } | { type: "italic"; text: string } | { type: "paragraph"; text: string };

function parseDescription(description: string): Block[] {
  const blocks: Block[] = [];
  const paragraphs = description.trim().split(/\n\n+/);
  for (const block of paragraphs) {
    const trimmed = block.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      blocks.push({ type: "heading", text: trimmed.replace(/\*\*/g, "") });
      continue;
    }
    if (trimmed.startsWith("•")) {
      const items = trimmed.split("\n").filter((l) => l.trim()).map((l) => l.replace(/^•\s*/, "").trim());
      blocks.push({ type: "bullets", items });
      continue;
    }
    if (trimmed.startsWith("*") && trimmed.endsWith("*")) {
      blocks.push({ type: "italic", text: trimmed.replace(/\*/g, "").trim() });
      continue;
    }
    blocks.push({ type: "paragraph", text: trimmed.replace(/\*\*(.+?)\*\*/g, "$1") });
  }
  return blocks;
}

export default function HatProductDetailClient({ product }: { product: Product }) {
  const blocks = product.description ? parseDescription(product.description) : [];

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
        {product.name}
      </h1>
      <p className="text-xl font-bold text-accent mb-6">
        ${product.price.toFixed(2)}
      </p>

      <AddToCartButton
        product={{ id: product.id, name: product.name, price: product.price, image: product.image }}
        category="hats"
      />

      {blocks.length > 0 ? (
        <div className="text-white/90 space-y-4 mt-8">
          {blocks.map((block, i) => {
            if (block.type === "heading") {
              return <h3 key={i} className="font-semibold text-white mt-6 mb-2">{block.text}</h3>;
            }
            if (block.type === "bullets") {
              return (
                <ul key={i} className="list-none space-y-1 pl-0">
                  {block.items.map((line, j) => (
                    <li key={j} className="flex gap-2">
                      <span className="text-accent">•</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              );
            }
            if (block.type === "italic") {
              return <p key={i} className="italic text-white/80">{block.text}</p>;
            }
            return <p key={i} className="leading-relaxed">{block.text}</p>;
          })}
        </div>
      ) : (
        <p className="text-white/70 mt-8">Product details coming soon.</p>
      )}
    </div>
  );
}
