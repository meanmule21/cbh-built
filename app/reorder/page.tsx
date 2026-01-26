"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import Header from "../components/Header";

export default function ReorderPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foundOrder, setFoundOrder] = useState<any | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // TODO: Implement actual order lookup from database
    // For now, simulate a lookup delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // TODO: Query order from Drupal database

    setIsLoading(false);

    // For demo purposes, show a message
    setError("Order lookup coming soon! For now, please start a new order or contact us with your previous order details.");
  };

  const handleReorder = () => {
    // TODO: Load order items into cart context and navigate to review
    router.push("/order/hats");
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="max-w-xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-pink to-magenta rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-text mb-2">Reorder</h1>
            <p className="text-gray-600">
              Look up a previous order to quickly reorder with the same logo and details.
            </p>
          </div>

          {/* Lookup Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-text mb-4">Find Your Order</h2>
            <form onSubmit={handleLookup} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text placeholder:text-gray-400"
                />
              </div>
              <div>
                <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Order Number
                </label>
                <input
                  type="text"
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="CBH-12345"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text placeholder:text-gray-400"
                />
              </div>

              {error && (
                <div className="p-4 bg-pink/10 border border-pink/20 rounded-lg">
                  <p className="text-sm text-magenta">{error}</p>
                </div>
              )}

              <Button type="submit" fullWidth disabled={isLoading}>
                {isLoading ? "Looking up..." : "Find Order"}
              </Button>
            </form>
          </div>

          {/* Found Order Preview (placeholder for future) */}
          {foundOrder && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="text-lg font-semibold text-text mb-4">Order Found</h2>
              {/* Order details would go here */}
              <Button onClick={handleReorder} fullWidth>
                Reorder This →
              </Button>
            </div>
          )}

          {/* Alternative Options */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-text mb-3">Other Options</h3>
            <div className="space-y-3">
              <Link
                href="/order/hats"
                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-primary/50 transition-colors group"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-text">Start New Order</p>
                  <p className="text-sm text-gray-500">Build a fresh order from scratch</p>
                </div>
              </Link>
              
              <a
                href="mailto:sales@meanmuleapparel.com?subject=Reorder%20Request"
                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-primary/50 transition-colors group"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-text">Contact Us</p>
                  <p className="text-sm text-gray-500">Email us your previous order details</p>
                </div>
              </a>
            </div>
          </div>

          {/* Back Link */}
          <div className="text-center mt-8">
            <Link href="/" className="text-primary hover:text-secondary transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}



