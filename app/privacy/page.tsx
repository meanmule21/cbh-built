import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Custom Business Hats",
  description: "Privacy Policy for Custom Business Hats - Learn how we collect, use, and protect your information.",
};

export default function PrivacyPolicyPage() {
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
        <h1 className="text-3xl font-bold text-primary mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none space-y-6 text-text">
          <p className="text-gray-600">
            <strong>Last Updated:</strong> November 2024
          </p>

          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">1. Information We Collect</h2>
            <p>
              When you place an order with Custom Business Hats, we collect the following information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Contact Information:</strong> Name, email address, phone number, and shipping address</li>
              <li><strong>Order Information:</strong> Products ordered, quantities, customization details, and artwork files</li>
              <li><strong>Payment Information:</strong> Payment is processed securely through Stripe. We do not store your full credit card information on our servers.</li>
              <li><strong>Communication Records:</strong> Emails and messages exchanged regarding your order</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your order status</li>
              <li>Provide customer support</li>
              <li>Send order confirmations and shipping notifications</li>
              <li>Improve our products and services</li>
              <li>Send promotional emails (only if you opt-in)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">3. Information Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share your information with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Shipping Partners:</strong> To deliver your order (USPS, UPS, FedEx)</li>
              <li><strong>Payment Processors:</strong> Stripe for secure payment processing</li>
              <li><strong>Service Providers:</strong> Who assist us in operating our business</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>SSL encryption for all data transmission</li>
              <li>Secure payment processing through Stripe (PCI-DSS compliant)</li>
              <li>Limited access to personal information by authorized personnel only</li>
              <li>Regular security assessments and updates</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">5. Cookies</h2>
            <p>
              Our website uses cookies to enhance your browsing experience. Cookies help us:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Remember your cart contents</li>
              <li>Understand how you use our website</li>
              <li>Improve our website functionality</li>
            </ul>
            <p className="mt-4">
              You can disable cookies in your browser settings, but some features of our website may not function properly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information (subject to legal requirements)</li>
              <li>Opt-out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">7. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, 
              comply with legal obligations, resolve disputes, and enforce our agreements. Order records are typically 
              retained for 7 years for tax and legal purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">8. Children&apos;s Privacy</h2>
            <p>
              Our services are not directed to children under 13 years of age. We do not knowingly collect personal 
              information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the 
              new Privacy Policy on this page and updating the &quot;Last Updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-4">
              <strong>Email:</strong>{" "}
              <a href="mailto:sales@meanmuleapparel.com" className="text-accent hover:underline">
                sales@meanmuleapparel.com
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

