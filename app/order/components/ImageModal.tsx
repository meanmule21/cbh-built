"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ImageModalProps {
  src: string;
  alt: string;
  children: React.ReactNode;
}

export default function ImageModal({ src, alt, children }: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Clickable trigger */}
      <div 
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }} 
        className="cursor-zoom-in"
      >
        {children}
      </div>

      {/* Modal overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image container */}
          <div 
            className="relative max-w-4xl max-h-[90vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          </div>

          {/* Caption */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-lg">
            <p className="text-white text-sm font-medium">{alt}</p>
          </div>

          {/* Click anywhere to close hint */}
          <p className="absolute bottom-4 right-4 text-white/50 text-xs">
            Click anywhere or press ESC to close
          </p>
        </div>
      )}
    </>
  );
}

