import Link from "next/link";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact Us | Custom Business Hats",
  description:
    "Contact Custom Business Hats – questions, custom hat inquiries, or support. We respond promptly to all messages.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
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
        <h1 className="text-3xl font-bold text-accent mb-4">Contact Us</h1>
        <p className="text-text mb-8 max-w-xl">
          Have a question or want to discuss a custom order? Fill out the form below and we&apos;ll get back to you
          at <strong className="text-accent">sales@meanmuleapparel.com</strong>.
        </p>
        <ContactForm />
      </main>
    </div>
  );
}
