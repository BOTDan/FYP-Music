import React, { useRef, useState } from 'react';
import './SquareImage.scss';

export interface SquareImageProps {
  src?: string;
  alt?: string;
  className?: string;
  fallbackSrc?: string;
}

export function SquareImage({
  src, alt, className, fallbackSrc,
}: SquareImageProps) {
  const [imgSrc, setImgSrc] = useState(src ?? fallbackSrc);
  const errored = useRef(false);

  const onError = () => {
    if (errored.current) { return; }

    errored.current = true;
    if (fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <div className={`SquareImage ${className}`}>
      <div className="SquareImage__Inner">
        <img src={imgSrc} alt={alt} onError={onError} />
      </div>
    </div>
  );
}

SquareImage.defaultProps = {
  src: undefined,
  alt: undefined,
  className: '',
  fallbackSrc: '',
};
