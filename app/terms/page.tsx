import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Custom Business Hats",
  description: "Terms of Service for Custom Business Hats - Read our terms and conditions for ordering custom embroidered hats.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-white py-4">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/cbh-icon.png.jpg" alt="CBH Logo" className="w-10 h-10 rounded" />
            <span className="font-bold text-lg">Custom Business Hats</span>
          </Link>
          <Link href="/" className="text-sm hover:underline">
            ← Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-primary mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none space-y-6 text-text">
          <p className="text-gray-600">
            <strong>Last Updated:</strong> November 2024
          </p>

          <p>
            Welcome to Custom Business Hats. By placing an order with us, you agree to these Terms of Service. 
            Please read them carefully before ordering.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">1. Order Acceptance</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All orders are subject to acceptance and availability.</li>
              <li>We reserve the right to refuse or cancel any order for any reason.</li>
              <li>Once an order is placed and payment is processed, it is considered confirmed.</li>
              <li>You will receive an order confirmation email with your order details.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">2. Artwork Requirements</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must own or have legal rights to use any artwork, logos, or designs submitted.</li>
              <li>We accept vector files (AI, EPS, PDF) for best quality. High-resolution PNG/JPG files are also accepted.</li>
              <li>We reserve the right to refuse any artwork that infringes on trademarks, copyrights, or contains inappropriate content.</li>
              <li>A $40 artwork setup fee applies for new designs. This fee is waived for orders of 12+ items.</li>
              <li>Minor artwork adjustments are included. Significant redesigns may incur additional charges.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">3. Pricing & Payment</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All prices are in US Dollars (USD).</li>
              <li>Prices are subject to change without notice.</li>
              <li>Volume discounts are automatically applied at checkout based on quantity.</li>
              <li>Payment is due in full at the time of order.</li>
              <li>We accept major credit cards through our secure Stripe payment processor.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">4. Production & Delivery</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Standard production time is 10-15 business days after artwork approval.</li>
              <li>Rush orders may be available for an additional fee - contact us to inquire.</li>
              <li>Shipping time is in addition to production time.</li>
              <li>Free shipping is available on orders of 24+ items within the continental United States.</li>
              <li>We are not responsible for delays caused by shipping carriers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">5. Quality Guarantee</h2>
            <p>
              We stand behind the quality of our work. If you receive a defective product or your order 
              does not match the approved proof, we will:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Replace the defective items at no charge, OR</li>
              <li>Issue a full refund for the defective items</li>
            </ul>
            <p className="mt-4">
              Claims must be made within 7 days of receiving your order with photos of the issue.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">6. Returns & Cancellations</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Custom orders cannot be returned or refunded</strong> unless there is a manufacturing defect or error on our part.</li>
              <li>Orders may be cancelled within 24 hours of placement for a full refund, provided production has not begun.</li>
              <li>Once production has started, orders cannot be cancelled.</li>
              <li>Color variations may occur due to differences in screen displays and embroidery thread.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">7. Intellectual Property</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You retain ownership of any artwork you provide.</li>
              <li>By submitting artwork, you grant us permission to use it for producing your order.</li>
              <li>We may use photos of completed orders for marketing purposes unless you request otherwise.</li>
              <li>We will not share your artwork with third parties.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">8. Limitation of Liability</h2>
            <p>
              Custom Business Hats shall not be liable for any indirect, incidental, special, or consequential 
              damages arising from the use of our products or services. Our total liability shall not exceed 
              the amount paid for the specific order in question.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">9. Dispute Resolution</h2>
            <p>
              Any disputes arising from these terms or your order will be resolved through good-faith negotiation. 
              If a resolution cannot be reached, disputes will be subject to binding arbitration in accordance 
              with the rules of the American Arbitration Association.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">10. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. Changes will be effective 
              immediately upon posting to this page. Your continued use of our services constitutes acceptance 
              of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-primary mt-8 mb-4">11. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="mt-4">
              <strong>Email:</strong>{" "}
              <a href="mailto:support@custombusinesshats.com" className="text-accent hover:underline">
                support@custombusinesshats.com
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

