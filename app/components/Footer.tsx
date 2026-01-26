import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      {/* Main Footer */}
      <div className="px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <img 
                src="/mean-mule-logo.png" 
                alt="Mean Mule Apparel - Hard Headed, Hard Working" 
                className="h-16 sm:h-20 object-contain"
              />
            </div>
            <p className="text-white/70 text-sm mb-4">
              Premium custom embroidered hats for businesses, teams, and events. Quality you can trust.
            </p>
            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <a href="mailto:sales@meanmuleapparel.com" className="flex items-center gap-2 text-white/70 hover:text-pink transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                sales@meanmuleapparel.com
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/order/hats" className="text-white/70 hover:text-pink transition-colors">
                  Start New Order
                </Link>
              </li>
              <li>
                <Link href="/reorder" className="text-white/70 hover:text-pink transition-colors">
                  Reorder
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-white/70 hover:text-pink transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-white/70 hover:text-pink transition-colors">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="font-semibold mb-4">Policies</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/returns" className="text-white/70 hover:text-pink transition-colors">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/70 hover:text-pink transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-white/70 hover:text-pink transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Guarantees */}
          <div>
            <h3 className="font-semibold mb-4">Our Guarantee</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-pink flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white/70">100% Satisfaction Guaranteed</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-pink flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white/70">Free Artwork Proofs</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-pink flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white/70">No Hidden Fees</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mt-6">
              <p className="text-xs text-white/50 mb-2">Secure Payment</p>
              <div className="flex items-center gap-2">
                {/* Visa */}
                <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                  <span className="text-[10px] font-bold text-blue-800">VISA</span>
                </div>
                {/* Mastercard */}
                <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                  <span className="text-[10px] font-bold text-red-600">MC</span>
                </div>
                {/* Amex */}
                <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                  <span className="text-[8px] font-bold text-blue-600">AMEX</span>
                </div>
                {/* PayPal */}
                <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                  <span className="text-[8px] font-bold text-blue-900">PayPal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-sm">
              © {new Date().getFullYear()} Custom Business Hats. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {/* SSL Badge */}
              <div className="flex items-center gap-1 text-xs text-white/50">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                SSL Secured
              </div>
              {/* Made in USA */}
              <div className="flex items-center gap-1 text-xs text-white/50">
                <span>🇺🇸</span>
                Made in USA
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

