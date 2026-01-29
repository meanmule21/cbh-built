import Link from "next/link";

export const metadata = {
  title: "Return Policy | Custom Business Hats",
  description: "Return and Refund Policy for Custom Business Hats - Learn about our satisfaction guarantee and return process.",
};

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-white py-4">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/mean-mule-logo.png" alt="Mean Mule Apparel Logo" className="w-10 h-10 rounded" />
            <span className="font-bold text-lg">Custom Business Hats</span>
          </Link>
          <Link href="/" className="text-sm hover:underline">
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Return & Refund Policy</h1>
        
        <div className="prose prose-lg max-w-none space-y-6 text-white">
          <p className="text-white/90">
            <strong>Last Updated:</strong> November 2024
          </p>

          {/* Guarantee Banner */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 my-8">
            <div className="flex items-center gap-3 mb-3">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h2 className="text-xl font-bold text-green-800 m-0">100% Satisfaction Guarantee</h2>
            </div>
            <p className="text-green-700 m-0">
              We stand behind every hat we produce. If there&apos;s an issue with your order, we&apos;ll make it right.
            </p>
          </div>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">Understanding Custom Products</h2>
            <p className="text-white">
              Because each order is custom-made specifically for you with your unique artwork and specifications, 
              our return policy differs from standard retail stores. Please review our policy carefully before 
              placing your order.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">When We Accept Returns</h2>
            <p className="text-white">
              We will gladly accept returns and provide a full refund or replacement in the following situations:
            </p>
            
            <div className="bg-black border border-yellow/30 rounded-lg p-6 mt-4">
              <h3 className="font-semibold text-yellow mb-3">✓ Manufacturing Defects</h3>
              <ul className="list-disc pl-6 space-y-2 text-white">
                <li>Embroidery errors (misspellings, incorrect design)</li>
                <li>Thread breaks or loose stitching</li>
                <li>Incorrect hat color or style sent</li>
                <li>Damaged hats (holes, stains, structural defects)</li>
              </ul>
            </div>

            <div className="bg-black border border-yellow/30 rounded-lg p-6 mt-4">
              <h3 className="font-semibold text-yellow mb-3">✓ Our Mistakes</h3>
              <ul className="list-disc pl-6 space-y-2 text-white">
                <li>Wrong quantity shipped</li>
                <li>Design placed in wrong location</li>
                <li>Design does not match approved proof</li>
                <li>Wrong embroidery type (standard vs. 3D puff)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">When We Cannot Accept Returns</h2>
            <p className="text-white">
              Due to the custom nature of our products, we cannot accept returns for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-white">
              <li>Change of mind or no longer needed</li>
              <li>Artwork issues that were approved by you in the proof</li>
              <li>Minor color variations (thread colors may vary slightly from screen displays)</li>
              <li>Incorrect information provided by the customer (spelling, sizing, etc.)</li>
              <li>Orders that have been worn, washed, or altered</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">How to Request a Return</h2>
            <div className="bg-white rounded-lg p-6 text-black">
              <ol className="list-decimal pl-6 space-y-4">
                <li>
                  <strong className="font-bold">Contact us within 7 days</strong> of receiving your order at{" "}
                  <a href="mailto:sales@meanmuleapparel.com" className="text-black hover:underline font-medium">
                    sales@meanmuleapparel.com
                  </a>
                </li>
                <li>
                  <strong className="font-bold">Include in your email:</strong>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Your order number</li>
                    <li>Clear photos showing the issue</li>
                    <li>Description of the problem</li>
                  </ul>
                </li>
                <li>
                  <strong className="font-bold">Wait for our response.</strong> We typically respond within 1 business day.
                </li>
                <li>
                  <strong className="font-bold">If approved,</strong> we will either:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Send replacement items at no charge</li>
                    <li>Issue a refund to your original payment method</li>
                  </ul>
                </li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">Order Cancellations</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">Within 24 Hours</h3>
                <p className="text-green-700 text-sm">
                  Full refund available if production has not started.
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">After 24 Hours</h3>
                <p className="text-yellow-700 text-sm">
                  Cancellation may not be possible once production begins.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">Refund Processing</h2>
            <ul className="list-disc pl-6 space-y-2 text-white">
              <li>Approved refunds are processed within 3-5 business days</li>
              <li>Refunds are issued to the original payment method</li>
              <li>It may take 5-10 business days for the refund to appear on your statement</li>
              <li>Shipping costs are non-refundable unless the return is due to our error</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">Damaged During Shipping</h2>
            <p className="text-white">
              If your order arrives damaged due to shipping:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-white">
              <li>Take photos of the damaged packaging and products immediately</li>
              <li>Contact us within 48 hours of delivery</li>
              <li>Keep all packaging materials for potential carrier claims</li>
              <li>We will work with the shipping carrier to resolve the issue and replace your items</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">Questions?</h2>
            <p className="text-white">
              We&apos;re here to help! If you have any questions about our return policy or need assistance 
              with an order, please don&apos;t hesitate to contact us:
            </p>
            <p className="mt-4 text-white">
              <strong>Email:</strong>{" "}
              <a href="mailto:sales@meanmuleapparel.com" className="text-yellow hover:underline">
                sales@meanmuleapparel.com
              </a>
            </p>
            <p className="text-white mt-2">
              We typically respond within 1 business day.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

