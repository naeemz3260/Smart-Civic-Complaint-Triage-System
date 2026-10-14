import React, { useState } from 'react';
import { ImageOff, Loader2 } from 'lucide-react';

// Map requested paths cleanly to valid public static assets
export const DEFAULT_PHOTO_MAP: Record<string, string> = {
  // Hero & Backgrounds
  '/images/hero-street.jpg': '/images/hero-street.jpg',
  '/images/pakistan-hero.jpg': '/images/pakistan-hero.jpg',
  '/images/pakistan-boulevard.jpg': '/images/pakistan-boulevard.jpg',
  '/images/pakistan-sanitation.jpg': '/images/pakistan-sanitation.jpg',
  '/images/pakistan-repair.jpg': '/images/pakistan-repair.jpg',
  '/images/pakistan-water.jpg': '/images/pakistan-water.jpg',
  '/images/pakistan-night.jpg': '/images/pakistan-night.jpg',

  // Category before / after issues
  '/images/issue-streetlight-night.jpg': '/images/issue-streetlight-night.jpg',
  '/images/after-streetlight-fixed.jpg': '/images/after-streetlight-fixed.jpg',
  '/images/issue-pothole.jpg': '/images/issue-pothole.jpg',
  '/images/after-pothole-fixed.jpg': '/images/after-pothole-fixed.jpg',
  '/images/issue-garbage.jpg': '/images/issue-garbage.jpg',
  '/images/after-garbage-cleared.jpg': '/images/after-garbage-cleared.jpg',
  '/images/issue-drain-blocked.jpg': '/images/issue-drain-blocked.jpg',
  '/images/after-drain-cleared.jpg': '/images/after-drain-cleared.jpg',
  '/images/issue-water-leak.jpg': '/images/issue-water-leak.jpg',
  '/images/after-leak-fixed.jpg': '/images/after-leak-fixed.jpg'
};

interface ImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: 'aspect-video' | 'aspect-[4/3]' | 'aspect-square' | 'aspect-[16/9]' | 'aspect-[3/2]' | 'aspect-[2/1]';
  className?: string;
  containerClassName?: string;
  enableHoverColor?: boolean;
}

export const Img: React.FC<ImgProps> = ({
  src,
  alt,
  aspectRatio = 'aspect-video',
  className = '',
  containerClassName = '',
  enableHoverColor = true,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Map requested path (like /images/hero-street.jpg) to real asset if mapped
  const resolvedSrc = DEFAULT_PHOTO_MAP[src] || src;

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-xl bg-[#E3EAE7]/40 transition-all duration-500 ${aspectRatio} ${
        enableHoverColor ? 'hover:shadow-[0_12px_32px_rgba(30,142,110,0.22)] hover:ring-2 hover:ring-[#1E8E6E]/60' : ''
      } ${containerClassName}`}
    >
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#F5F8F7]/80 z-10">
          <Loader2 className="w-5 h-5 text-[#1E8E6E] animate-spin" />
        </div>
      )}

      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#E3EAE7]/60 text-[#6B7C77] p-3 text-center">
          <ImageOff className="w-6 h-6 mb-1 text-[#6B7C77]" />
          <span className="text-xs font-medium line-clamp-1">{alt}</span>
        </div>
      ) : (
        <>
          <img
            src={resolvedSrc}
            alt={alt}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={handleError}
            onLoad={handleLoad}
            className={`w-full h-full object-cover transition-all duration-700 ease-out ${
              isLoading ? 'opacity-0' : 'opacity-100'
            } ${
              enableHoverColor
                ? 'group-hover:scale-105 group-hover:brightness-110 group-hover:contrast-105 group-hover:saturate-125'
                : ''
            } ${className}`}
            {...props}
          />
          {/* Subtle color-shift gradient sheen that emerges on hover */}
          {enableHoverColor && (
            <div className="absolute inset-0 bg-gradient-to-t from-[#166F57]/30 via-transparent to-[#2F7DD1]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          )}
        </>
      )}
    </div>
  );
};
