"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  href?: string;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  fullWidth?: boolean;
}

export default function Button({
  children,
  onClick,
  type = "button",
  href,
  disabled = false,
  variant = "primary",
  className = "",
  fullWidth = false,
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold rounded-lg px-6 py-3 transition-all duration-200";
  
  const variantStyles = {
    primary: "bg-primary hover:bg-secondary text-white shadow-lg hover:shadow-xl",
    secondary: "bg-secondary hover:bg-primary text-white shadow-lg hover:shadow-xl",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
  };

  const disabledStyles = "opacity-50 cursor-not-allowed pointer-events-none";
  const widthStyles = fullWidth ? "w-full" : "";

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${disabled ? disabledStyles : ""} ${widthStyles} ${className}`.trim();

  if (href && !disabled) {
    return (
      <Link href={href} className={combinedStyles}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedStyles}
    >
      {children}
    </button>
  );
}



