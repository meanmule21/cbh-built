"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Step {
  number: number;
  label: string;
  path: string;
}

const steps: Step[] = [
  { number: 1, label: "Hats", path: "/order/hats" },
  { number: 2, label: "Artwork", path: "/order/artwork" },
  { number: 3, label: "Review", path: "/order/review" },
  { number: 4, label: "Checkout", path: "/order/checkout" },
];

export default function StepIndicator() {
  const pathname = usePathname();

  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => pathname === step.path);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <nav className="w-full py-6">
      <ol className="flex items-center justify-center gap-2 md:gap-4">
        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          const isClickable = index <= currentStepIndex;

          return (
            <li key={step.path} className="flex items-center">
              {isClickable ? (
                <Link
                  href={step.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-md"
                      : isCompleted
                      ? "bg-pink/20 text-primary hover:bg-pink/30"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold ${
                      isActive
                        ? "bg-white text-primary"
                        : isCompleted
                        ? "bg-primary text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {isCompleted ? (
                      <svg
                        className="w-4 h-4"
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
                    ) : (
                      step.number
                    )}
                  </span>
                  <span className="hidden sm:inline font-medium">{step.label}</span>
                </Link>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold bg-gray-200 text-gray-400">
                    {step.number}
                  </span>
                  <span className="hidden sm:inline font-medium">{step.label}</span>
                </div>
              )}

              {index < steps.length - 1 && (
                <div
                  className={`hidden md:block w-8 h-0.5 mx-2 ${
                    index < currentStepIndex ? "bg-primary" : "bg-gray-200"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
