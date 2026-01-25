"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "../components/Button";
import { RewardTier, REWARD_TIERS, getTierBenefits } from "@/lib/database.types";

interface CustomerData {
  id: string;
  email: string;
  name: string | null;
  total_lifetime_spend: number;
  total_hats_ordered: number;
  reward_tier: RewardTier;
  has_setup_fee_paid: boolean;
}

interface OrderData {
  id: string;
  order_number: string;
  total_amount: number;
  total_hats: number;
  status: string;
  created_at: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
  }>;
}

interface LogoData {
  id: string;
  filename: string;
  public_url: string | null;
  created_at: string;
}

const tierColors: Record<RewardTier, string> = {
  Bronze: "from-amber-600 to-amber-700",
  Silver: "from-gray-400 to-gray-500",
  Gold: "from-yellow-400 to-yellow-500",
  VIP: "from-purple-500 to-purple-600",
  Elite: "from-blue-500 to-blue-600",
  Diamond: "from-cyan-400 to-cyan-500",
  Platinum: "from-slate-300 to-slate-400",
};

const tierIcons: Record<RewardTier, string> = {
  Bronze: "🥉",
  Silver: "🥈",
  Gold: "🥇",
  VIP: "⭐",
  Elite: "💎",
  Diamond: "💠",
  Platinum: "👑",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-green-100 text-green-800",
  delivered: "bg-green-200 text-green-900",
  cancelled: "bg-red-100 text-red-800",
};

export default function MyOrdersPage() {
  const [email, setEmail] = useState("");
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [logos, setLogos] = useState<LogoData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);

    // Use mock data
    const { getCustomerByEmail, getCustomerOrders, getCustomerLogos } = await import("@/data/mockData");
    const customer = getCustomerByEmail(email.trim());
    const orders = getCustomerOrders(email.trim());
    const logos = getCustomerLogos(email.trim());

    if (!customer) {
      setError("No account found with this email. Place an order to create your account!");
      setCustomer(null);
      setOrders([]);
      setLogos([]);
    } else {
      setCustomer(customer as any);
      setOrders(orders as any);
      setLogos(logos as any);
    }
    setSearched(true);
    setLoading(false);
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const benefits = customer ? getTierBenefits(customer.reward_tier) : null;
  const nextTierIndex = customer ? REWARD_TIERS.findIndex(t => t.tier === customer.reward_tier) + 1 : 0;
  const nextTier = nextTierIndex < REWARD_TIERS.length ? REWARD_TIERS[nextTierIndex] : null;
  const progressToNext = customer && nextTier 
    ? Math.min(100, (customer.total_lifetime_spend / nextTier.minSpend) * 100)
    : 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-primary shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-white">
              Custom Business Hats
            </Link>
            <Link href="/order/hats">
              <Button className="bg-accent hover:bg-accent-dark">
                Start New Order
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-text mb-2 text-center">My Account</h1>
        <p className="text-gray-600 text-center mb-8">
          View your order history, rewards status, and saved logos
        </p>

        {/* Email Lookup Form */}
        {!customer && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
            <form onSubmit={handleLookup} className="max-w-md mx-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your email to view your account
              </label>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
                <Button type="submit" disabled={loading}>
                  {loading ? "Looking up..." : "Look Up"}
                </Button>
              </div>
              {error && searched && (
                <p className="mt-3 text-red-600 text-sm">{error}</p>
              )}
            </form>
          </div>
        )}

        {/* Customer Dashboard */}
        {customer && (
          <div className="space-y-6">
            {/* Change Account Button */}
            <div className="text-right">
              <button
                onClick={() => {
                  setCustomer(null);
                  setOrders([]);
                  setLogos([]);
                  setSearched(false);
                  setEmail("");
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Look up different email
              </button>
            </div>

            {/* Rewards Card */}
            <div className={`bg-gradient-to-r ${tierColors[customer.reward_tier]} rounded-xl p-6 text-white shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-5xl">{tierIcons[customer.reward_tier]}</span>
                  <div>
                    <p className="text-sm opacity-90">Welcome back!</p>
                    <p className="text-2xl font-bold">{customer.reward_tier} Member</p>
                    <p className="text-sm opacity-75">{customer.email}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-sm opacity-90">Lifetime Spend</p>
                  <p className="text-2xl font-bold">{formatCurrency(customer.total_lifetime_spend)}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-sm opacity-90">Total Hats Ordered</p>
                  <p className="text-2xl font-bold">{customer.total_hats_ordered}</p>
                </div>
              </div>

              {/* Progress to Next Tier */}
              {nextTier && (
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress to {nextTier.tier}</span>
                    <span>{formatCurrency(nextTier.minSpend - customer.total_lifetime_spend)} to go</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div
                      className="bg-white rounded-full h-3 transition-all duration-500"
                      style={{ width: `${progressToNext}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Your Benefits */}
            {benefits && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-text mb-4">Your Benefits</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className={`p-3 rounded-lg ${benefits.artworkCredit ? "bg-green-50 text-green-800" : "bg-gray-100 text-gray-400"}`}>
                    <span className="text-lg mr-2">{benefits.artworkCredit ? "✅" : "🔒"}</span>
                    $50 Artwork Credit
                  </div>
                  <div className={`p-3 rounded-lg ${benefits.partnerCredit ? "bg-green-50 text-green-800" : "bg-gray-100 text-gray-400"}`}>
                    <span className="text-lg mr-2">{benefits.partnerCredit ? "✅" : "🔒"}</span>
                    $50 Partner Credit
                  </div>
                  <div className={`p-3 rounded-lg ${benefits.freeShipping12 ? "bg-green-50 text-green-800" : "bg-gray-100 text-gray-400"}`}>
                    <span className="text-lg mr-2">{benefits.freeShipping12 ? "✅" : "🔒"}</span>
                    Free Shipping @12
                  </div>
                  <div className={`p-3 rounded-lg ${benefits.rewardsCashPercent > 0 ? "bg-green-50 text-green-800" : "bg-gray-100 text-gray-400"}`}>
                    <span className="text-lg mr-2">{benefits.rewardsCashPercent > 0 ? "✅" : "🔒"}</span>
                    {benefits.rewardsCashPercent}% Rewards Cash
                  </div>
                  <div className={`p-3 rounded-lg ${benefits.accountManager ? "bg-green-50 text-green-800" : "bg-gray-100 text-gray-400"}`}>
                    <span className="text-lg mr-2">{benefits.accountManager ? "✅" : "🔒"}</span>
                    Account Manager
                  </div>
                  <div className={`p-3 rounded-lg ${benefits.freeArtworkSampling ? "bg-green-50 text-green-800" : "bg-gray-100 text-gray-400"}`}>
                    <span className="text-lg mr-2">{benefits.freeArtworkSampling ? "✅" : "🔒"}</span>
                    Free Sampling
                  </div>
                </div>

                {/* Setup Fee Status */}
                {customer.has_setup_fee_paid && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-medium">
                      ✅ Artwork Setup Fee Waived — As a returning customer, you won&apos;t be charged the $50 setup fee on future orders!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Saved Logos */}
            {logos.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-text mb-4">Saved Logos</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {logos.map((logo) => (
                    <div key={logo.id} className="border border-gray-200 rounded-lg p-3 text-center">
                      {logo.public_url ? (
                        <img
                          src={logo.public_url}
                          alt={logo.filename}
                          className="w-full h-24 object-contain mb-2"
                        />
                      ) : (
                        <div className="w-full h-24 bg-gray-100 rounded flex items-center justify-center mb-2">
                          <span className="text-gray-400 text-sm">No preview</span>
                        </div>
                      )}
                      <p className="text-xs text-gray-600 truncate">{logo.filename}</p>
                      <p className="text-xs text-gray-400">{formatDate(logo.created_at)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order History */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-text mb-4">Order History</h2>
              {orders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No orders yet</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-bold text-text">Order #{order.order_number}</span>
                          <span className="text-gray-500 text-sm ml-3">{formatDate(order.created_at)}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || "bg-gray-100"}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">{order.total_hats} hats</span>
                        <span className="font-bold text-primary">{formatCurrency(order.total_amount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reorder CTA */}
            <div className="bg-gradient-to-r from-primary to-royal rounded-xl p-6 text-white text-center">
              <h3 className="text-xl font-bold mb-2">Ready to Order More Hats?</h3>
              <p className="opacity-90 mb-4">
                {customer.has_setup_fee_paid 
                  ? "Your artwork setup fee is waived — just select your hats and go!"
                  : "Start your next order today!"
                }
              </p>
              <Link href={`/order/hats?email=${encodeURIComponent(customer.email)}`}>
                <Button className="bg-white text-primary hover:bg-gray-100">
                  Start New Order
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

