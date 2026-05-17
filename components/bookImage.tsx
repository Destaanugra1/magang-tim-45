"use client";

import Image from "next/image";
import { useState } from "react";




function ErrorImage({ src, alt }: { src: string; alt?: string }) {
  const [error, setError] = useState(false);
  if (error) return null;

  return (
    <Image
      src={src}
      alt={alt ?? ""}
      width={200}
      height={300}
      unoptimized
      onError={() => {
        setError(true);
      }}
    />
  );
}

export default ErrorImage;
