'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean; // ← добавь эту строку
}


export function ImageWithFallback({
  src,
  alt = '',
  className = '',
  width = 800,
  height = 600,
  ...rest
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  return (
    <Image
      {...rest}
      src={error ? '/fallback.jpg' : src}
      alt={alt}
      width={width}
      height={height}
      className={`object-cover rounded-[20px] ${className}`}
      onError={() => setError(true)}
      style={{ width: '100%', height: 'auto' }}
      priority
    />
  );
}
