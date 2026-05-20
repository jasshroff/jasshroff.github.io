import React from 'react';
import { Img } from 'vite-imagetools';

/**
 * OptimizedImage renders a static image using vite-imagetools for automatic compression.
 * Props:
 *   src: string - relative path to the image (e.g., '/images/logo.png')
 *   alt: string - alt text for accessibility
 *   className?: string - any Tailwind or CSS classes
 *   width?: number | string - optional width (will be passed to imagetools)
 *   height?: number | string - optional height
 *   ...rest: any other img attributes
 */
export const OptimizedImage = ({ src, alt = '', className = '', width, height, ...rest }) => {
  const params = new URLSearchParams();
  params.set('format', 'webp');
  params.set('quality', '80');
  if (width) params.set('width', width);
  if (height) params.set('height', height);

  const optimizedSrc = `${src}?${params.toString()}`;
  return <Img src={optimizedSrc} alt={alt} className={className} {...rest} />;
};
