'use client';

import React, { useState, useEffect } from 'react';

interface FallbackImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc: string;
}

export default function FallbackImage({ src, fallbackSrc, alt, ...props }: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <img
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        if (imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
      }}
    />
  );
}
