"use client";

import HatList from "../components/HatList";
import CartSummary from "../components/CartSummary";
import CartPerksBar from "../components/CartPerksBar";
import Button from "../../components/Button";
import { useOrder } from "../context/OrderContext";

export default function HatsPage() {
  const { cartItems } = useOrder();
  const hasItems = cartItems.length > 0;

  return (
    <>
      <div className="min-h-screen pb-32">
        <div className="max-w-7xl mx-auto px-4 pt-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-text">Select Your Hats</h1>
            <p className="text-gray-500 text-sm">
              Set quantities below — cart updates instantly
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[5fr,2fr] gap-8 items-start">
            <section>
              <HatList />
            </section>

            <aside id="cart-panel">
              <div className="sticky top-20 space-y-3">
                <CartSummary />

                {hasItems ? (
                  <Button href="/order/artwork" fullWidth className="py-3">
                    Next: Artwork →
                  </Button>
                ) : (
                  <div className="text-center py-3 px-4 bg-gray-100 rounded-lg text-gray-500 text-sm">
                    Set quantities to continue
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Fixed Cart Perks Bar at bottom */}
      <CartPerksBar />
    </>
  );
}
