"use client";

import { useState } from "react";

interface FamilyPhotoProps {
  src: string;
  alt: string;
  placeholder: string;
}

export default function FamilyPhoto({ src, alt, placeholder }: FamilyPhotoProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white/40 text-sm text-center p-4">
        {placeholder}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setHasError(true)}
    />
  );
}

