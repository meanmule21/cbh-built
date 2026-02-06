import type { ProductCardData } from "../ProductCard";

export interface HatProduct extends ProductCardData {
  description?: string;
}

export const HATS_PRODUCTS: HatProduct[] = [
  {
    id: "injected-camo-trucker",
    name: "Injected Motorsports Old School Camo Duck Trucker Hat",
    price: 29.99,
    image: "/products/hats/injected-camo-trucker-hat.png",
    reviewCount: 0,
    description: `Injected Motorsports Duck Camo Trucker Hat

Bring classic grit and modern style together with the Injected Motorsports Duck Camo Trucker Hat. Inspired by old-school outdoor gear and built for everyday wear, this snapback delivers the perfect mix of attitude, comfort, and authenticity.

Crafted in the iconic duck camo pattern, this hat channels vintage trucker vibes with a breathable mesh back, structured front panel, and a high-quality snapback closure for a custom fit. Each hat is made in Texas by a small local business, bringing true craftsmanship and homegrown pride to every stitch.

Built for the shop, the track, or the trail, it's designed to keep you cool and looking sharp—wherever the day takes you.

Featuring the Injected Motorsports logo front and center, this hat is more than gear—it's a statement of horsepower, heritage, and hard work.

**Details:**

• Made in Texas by a small business
• Classic duck camo pattern
• Trucker-style mesh back for ventilation
• Adjustable snapback closure
• Structured front with Injected Motorsports branding
• Comfortable, durable, and ready for the long haul

*Old-school look. Modern performance.*`,
  },
  { id: "1", name: "Mean Mule Trucker Hat", price: 24.99, image: "/mean-mule-logo.png", reviewCount: 12 },
  { id: "2", name: "Classic Snapback Cap", price: 22.99, image: "/mean-mule-logo.png", reviewCount: 8 },
  { id: "3", name: "Structured Dad Cap", price: 26.99, image: "/mean-mule-logo.png", reviewCount: 15 },
  { id: "4", name: "Low Profile Embroidered Hat", price: 23.99, image: "/mean-mule-logo.png", reviewCount: 6 },
  { id: "5", name: "Mesh Back Trucker", price: 21.99, image: "/mean-mule-logo.png", reviewCount: 22 },
  { id: "6", name: "Washed Cotton Cap", price: 25.99, image: "/mean-mule-logo.png", reviewCount: 4 },
];

export function getHatById(id: string): HatProduct | undefined {
  return HATS_PRODUCTS.find((p) => p.id === id);
}
