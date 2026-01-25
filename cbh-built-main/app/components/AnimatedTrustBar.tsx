"use client";

export default function AnimatedTrustBar() {
  const trustItems = [
    { icon: "✓", text: "Free Shipping on 24+ Hats" },
    { icon: "✓", text: "100% Satisfaction Guarantee" },
    { icon: "✓", text: "Fast Turnaround" },
    { icon: "✓", text: "No Minimum Order" },
    { icon: "✓", text: "Premium Quality Embroidery" },
    { icon: "✓", text: "Free Artwork Setup at 12+" },
  ];

  // Double the items for seamless loop
  const duplicatedItems = [...trustItems, ...trustItems];

  return (
    <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 overflow-hidden">
      <div className="animate-marquee flex whitespace-nowrap">
        {duplicatedItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 mx-8 text-sm font-medium"
          >
            <span className="text-green-300">{item.icon}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

