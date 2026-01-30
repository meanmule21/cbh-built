"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "../../components/Button";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/checkout/session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setOrderData(data.session);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch order:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-accent border-t-transparent rounded-full mx-auto"></div>
        <p className="text-white/70 mt-4">Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      {/* Success Icon */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-12 h-12 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-accent mb-2">
          Payment Successful!
        </h1>
        <p className="text-white/80 mt-2">
          Thank you for your order. Your payment has been processed successfully.
        </p>
        {orderData && (
          <p className="text-white/60 text-sm mt-2">
            Order ID: {orderData.id}
          </p>
        )}
      </div>

      {/* Order Summary */}
      {orderData && (
        <div className="bg-black rounded-xl shadow-sm border border-yellow/30 p-6 mb-8">
          <h2 className="text-lg font-semibold text-accent mb-4">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/70">Email:</span>
              <span className="text-white">{orderData.customer_email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Payment Status:</span>
              <span className="text-green-500 capitalize">{orderData.payment_status}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-3 border-t border-white/10">
              <span className="text-white">Total Paid:</span>
              <span className="text-accent">
                ${((orderData.amount_total || 0) / 100).toFixed(2)}
              </span>
            </div>
            {orderData.metadata?.totalHats && (
              <p className="text-white/60 text-xs pt-2">
                {orderData.metadata.totalHats} custom embroidered hat{orderData.metadata.totalHats !== "1" ? "s" : ""}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Order Confirmation */}
      <div className="bg-black rounded-xl shadow-sm border border-yellow/30 p-6 mb-8">
        <h2 className="text-lg font-semibold text-accent mb-4">What Happens Next?</h2>
        <p className="text-white/80 mb-4">
          Your order is now being processed. Here&apos;s what to expect:
        </p>
        <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
          <li>You&apos;ll receive an email confirmation shortly</li>
          <li>Our team will review your artwork and reach out if needed</li>
          <li>Production typically takes 10-15 business days</li>
          <li>You&apos;ll receive tracking information once shipped</li>
        </ul>
        <p className="text-sm text-white/50">
          Please check your email for order confirmation and next steps.
        </p>
      </div>

      {/* Contact Info */}
      <div className="bg-black/50 rounded-xl p-6 mb-8 text-center border border-white/10">
        <p className="text-white/70">
          Questions about your order?{" "}
          <a
            href="mailto:sales@meanmuleapparel.com"
            className="text-accent hover:text-accent-dark font-medium"
          >
            Contact us
          </a>
        </p>
      </div>

      {/* Back to Home */}
      <div className="text-center">
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}