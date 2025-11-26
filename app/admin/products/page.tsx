"use client";

import { useState } from "react";
import Link from "next/link";

interface SSProduct {
  styleID: number;
  styleName: string;
  brandName: string;
  title: string;
  description: string;
  baseCategory: string;
}

interface SSStyle {
  styleID: number;
  partNumber: string;
  styleName: string;
  brandName: string;
  colorName: string;
  colorCode: string;
  sizeName: string;
  piecePrice: number;
}

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<SSProduct[]>([]);
  const [styles, setStyles] = useState<SSStyle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<SSProduct | null>(null);
  const [viewMode, setViewMode] = useState<"products" | "styles">("products");

  const searchProducts = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    setProducts([]);
    setStyles([]);
    setSelectedProduct(null);

    try {
      const response = await fetch(`/api/ss-products?search=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setProducts(data.products || []);
      setViewMode("products");
    } catch (err) {
      setError("Failed to search products. Make sure your API key is configured.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStyles = async (product: SSProduct) => {
    setLoading(true);
    setSelectedProduct(product);
    setError(null);

    try {
      const response = await fetch(`/api/ss-products?styleID=${product.styleID}&type=styles`);
      if (!response.ok) throw new Error("Failed to fetch styles");
      const data = await response.json();
      setStyles(data.styles || []);
      setViewMode("styles");
    } catch (err) {
      setError("Failed to load product styles");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateHatVariant = (style: SSStyle) => {
    const id = `${style.brandName.toLowerCase()}-${style.styleName.toLowerCase().replace(/\s+/g, "-")}-${style.colorName.toLowerCase().replace(/[\s/]+/g, "-")}`;
    return {
      id,
      brand: style.brandName,
      model: style.styleName,
      name: `${style.brandName} ${style.styleName}`,
      colorName: style.colorName,
      basePrice: Math.ceil(style.piecePrice * 1.5), // 50% markup example
      ssPartNumber: style.partNumber,
    };
  };

  const copyVariantCode = (style: SSStyle) => {
    const variant = generateHatVariant(style);
    const code = `{ id: "${variant.id}", brand: "${variant.brand}", model: "${variant.model}", name: "${variant.name}", colorName: "${variant.colorName}", basePrice: ${variant.basePrice}, ssPartNumber: "${variant.ssPartNumber}" },`;
    navigator.clipboard.writeText(code);
    alert("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white py-4 px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">SS Activewear Product Sync</h1>
            <p className="text-white/70 text-sm">Browse and add products from SS Activewear</p>
          </div>
          <Link href="/" className="text-sm hover:underline">
            ← Back to Site
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4">Search Products</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchProducts()}
              placeholder="Search for hats (e.g., Richardson 112, Yupoong trucker)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={searchProducts}
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
          
          {/* Quick filters */}
          <div className="flex gap-2 mt-4">
            <span className="text-sm text-gray-500">Quick search:</span>
            {["Richardson", "Yupoong", "Flexfit", "Otto"].map((brand) => (
              <button
                key={brand}
                onClick={() => {
                  setSearchQuery(brand);
                  setTimeout(searchProducts, 0);
                }}
                className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Results */}
        {viewMode === "products" && products.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-semibold text-lg mb-4">
              Products ({products.length} found)
            </h2>
            <div className="grid gap-4">
              {products.map((product) => (
                <div
                  key={product.styleID}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors"
                >
                  <div>
                    <h3 className="font-semibold">{product.brandName} {product.styleName}</h3>
                    <p className="text-sm text-gray-600">{product.title}</p>
                    <p className="text-xs text-gray-400">
                      Style ID: {product.styleID} | Category: {product.baseCategory}
                    </p>
                  </div>
                  <button
                    onClick={() => loadStyles(product)}
                    className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-magenta transition-colors text-sm"
                  >
                    View Colors →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Styles View */}
        {viewMode === "styles" && selectedProduct && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <button
                  onClick={() => setViewMode("products")}
                  className="text-sm text-gray-500 hover:text-primary mb-2"
                >
                  ← Back to products
                </button>
                <h2 className="font-semibold text-lg">
                  {selectedProduct.brandName} {selectedProduct.styleName}
                </h2>
                <p className="text-sm text-gray-600">{styles.length} color/size options</p>
              </div>
            </div>

            {/* Group by color */}
            <div className="space-y-3">
              {Array.from(new Set(styles.map((s) => s.colorName))).map((colorName) => {
                const colorStyles = styles.filter((s) => s.colorName === colorName);
                const firstStyle = colorStyles[0];
                return (
                  <div
                    key={colorName}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{colorName}</h3>
                      <p className="text-sm text-gray-500">
                        Part #: {firstStyle.partNumber} | 
                        Wholesale: ${firstStyle.piecePrice.toFixed(2)} | 
                        Suggested Retail: ${(firstStyle.piecePrice * 1.5).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyVariantCode(firstStyle)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Copy Code
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bulk copy */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Bulk Add All Colors</h3>
              <p className="text-sm text-gray-600 mb-3">
                Click below to copy all color variants for this product.
              </p>
              <button
                onClick={() => {
                  const uniqueColors = Array.from(new Set(styles.map((s) => s.colorName)));
                  const allCode = uniqueColors
                    .map((colorName) => {
                      const style = styles.find((s) => s.colorName === colorName)!;
                      const variant = generateHatVariant(style);
                      return `  { id: "${variant.id}", brand: "${variant.brand}", model: "${variant.model}", name: "${variant.name}", colorName: "${variant.colorName}", basePrice: ${variant.basePrice}, ssPartNumber: "${variant.ssPartNumber}" },`;
                    })
                    .join("\n");
                  navigator.clipboard.writeText(allCode);
                  alert(`Copied ${uniqueColors.length} variants to clipboard!`);
                }}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
              >
                Copy All {Array.from(new Set(styles.map((s) => s.colorName))).length} Colors
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">How to Add Products</h3>
          <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
            <li>Search for products using the search box above</li>
            <li>Click &quot;View Colors&quot; to see all available color options</li>
            <li>Click &quot;Copy Code&quot; to copy the hat variant code</li>
            <li>Paste the code into <code className="bg-blue-100 px-1 rounded">app/order/components/HatList.tsx</code></li>
            <li>Add the hat image to <code className="bg-blue-100 px-1 rounded">/public/hats/</code></li>
          </ol>
        </div>
      </main>
    </div>
  );
}

