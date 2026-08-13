import React from 'react';

/**
 * OptimizedImage renders an image with native lazy loading, async decoding,
 * and responsive alt/size attributes.
 * Props:
 *   src: string - path to the image
 *   alt: string - alt text for accessibility
 *   className?: string - any Tailwind or CSS classes
 *   loading?: 'lazy' | 'eager'
 *   width?: number | string
 *   height?: number | string
 *   ...rest: any other img attributes
 */
export const OptimizedImage = ({ 
  src, 
  alt = '', 
  className = '', 
  loading = 'lazy',
  width, 
  height, 
  ...rest 
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      width={width}
      height={height}
      {...rest}
    />
  );
};

export default OptimizedImage;
