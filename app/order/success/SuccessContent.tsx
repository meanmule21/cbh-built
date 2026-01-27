"use client";

import Link from "next/link";
import Button from "../../components/Button";


export default function SuccessContent() {

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
        <h1 className="text-3xl font-bold text-text mb-2">
          Thank You for Your Order!
        </h1>
        <p className="text-gray-600 mt-2">
          We&apos;ve received your order and will contact you shortly to finalize payment and shipping details.
        </p>
      </div>

      {/* Order Confirmation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-text mb-4">Order Received</h2>
        <p className="text-gray-600 mb-4">
          Your order has been submitted successfully. Our team will review your order and contact you within 1-2 business days to:
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
          <li>Confirm your order details</li>
          <li>Finalize payment arrangements</li>
          <li>Collect shipping information</li>
          <li>Review your artwork (if applicable)</li>
        </ul>
        <p className="text-sm text-gray-500">
          Please check your email for order confirmation and next steps.
        </p>
      </div>

      {/* What's Next */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-text mb-4">What&apos;s Next?</h2>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-semibold text-sm">1</span>
            </div>
            <div>
              <p className="font-medium text-text">Confirmation Email</p>
              <p className="text-sm text-gray-600">
                You&apos;ll receive an email confirmation with your order details shortly.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-semibold text-sm">2</span>
            </div>
            <div>
              <p className="font-medium text-text">Artwork Review</p>
              <p className="text-sm text-gray-600">
                Our team will review your artwork and reach out if we have any questions.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-semibold text-sm">3</span>
            </div>
            <div>
              <p className="font-medium text-text">Production & Shipping</p>
              <p className="text-sm text-gray-600">
                Your hats will be embroidered and shipped within 10-15 business days.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8 text-center">
        <p className="text-gray-600">
          Questions about your order?{" "}
          <a
            href="mailto:sales@meanmuleapparel.com"
            className="text-primary hover:text-secondary font-medium"
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