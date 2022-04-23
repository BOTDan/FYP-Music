import React, { useEffect, useRef, useState } from 'react';
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
  const [loaded, setLoaded] = useState(false);
  const errored = useRef(false);

  const onLoad = () => {
    setLoaded(true);
  };

  const onError = () => {
    if (errored.current) { return; }

    errored.current = true;
    if (fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  const classList = ['SquareImage'];
  if (className) { classList.push(className); }
  if (!loaded) { classList.push('Loading'); }

  return (
    <div className={classList.join(' ')}>
      <div className="SquareImage__Inner">
        <img
          onLoad={onLoad}
          onError={onError}
          src={imgSrc}
          alt={alt}
        />
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
