import { Metadata } from "next";
import { OrderProvider } from "./context/OrderContext";
import StepIndicator from "./components/StepIndicator";
import Header from "../components/Header";
import TrustBar from "../components/TrustBar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Order Custom Embroidered Hats",
  description: "Build your custom hat order. Choose from Richardson, Yupoong, Flexfit and more. Add your logo, select embroidery options, and checkout securely.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OrderProvider>
      <div className="min-h-screen bg-background text-text flex flex-col">
        {/* Trust Bar */}
        <TrustBar />

        {/* Header */}
        <Header />

        {/* Step Indicator */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4">
            <StepIndicator />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </OrderProvider>
  );
}
