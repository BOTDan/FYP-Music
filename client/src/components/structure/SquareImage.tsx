import React from 'react';
import './SquareImage.scss';

export interface SquareImageProps {
  src?: string;
  alt?: string;
  className?: string;
}

export function SquareImage({ src, alt, className }: SquareImageProps) {
  return (
    <div className={`SquareImage ${className}`}>
      <div className="SquareImage__Inner">
        <img src={src} alt={alt} />
      </div>
    </div>
  );
}

SquareImage.defaultProps = {
  src: undefined,
  alt: undefined,
  className: '',
};
