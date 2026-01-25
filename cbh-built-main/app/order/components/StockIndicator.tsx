"use client";

interface StockIndicatorProps {
  qty: number | null;
  loading?: boolean;
  showNumber?: boolean;
  size?: "sm" | "md";
}

export default function StockIndicator({
  qty,
  loading = false,
  showNumber = false,
  size = "sm",
}: StockIndicatorProps) {
  if (loading) {
    return (
      <span className={`inline-flex items-center gap-1 ${size === "sm" ? "text-[10px]" : "text-xs"} text-gray-400`}>
        <span className="w-2 h-2 rounded-full bg-gray-300 animate-pulse" />
        Checking...
      </span>
    );
  }

  if (qty === null || qty === -1) {
    return null; // Don't show anything if we can't fetch
  }

  if (qty === 0) {
    return (
      <span className={`inline-flex items-center gap-1 ${size === "sm" ? "text-[10px]" : "text-xs"} text-red-600 font-medium`}>
        <span className="w-2 h-2 rounded-full bg-red-500" />
        Out of Stock
      </span>
    );
  }

  if (qty < 24) {
    return (
      <span className={`inline-flex items-center gap-1 ${size === "sm" ? "text-[10px]" : "text-xs"} text-amber-600 font-medium`}>
        <span className="w-2 h-2 rounded-full bg-amber-500" />
        {showNumber ? `Only ${qty} left` : "Low Stock"}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 ${size === "sm" ? "text-[10px]" : "text-xs"} text-green-600 font-medium`}>
      <span className="w-2 h-2 rounded-full bg-green-500" />
      {showNumber ? `${qty} in stock` : "In Stock"}
    </span>
  );
}

