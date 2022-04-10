import React, { PropsWithChildren, ReactNode } from 'react';
import { SquareImage } from './SquareImage';
import './TopHeading.scss';

export interface TopHeadingProps extends PropsWithChildren<{}> {
  subheading: string | ReactNode | undefined;
  image?: string;
  imageFallback?: string;
  right?: ReactNode;
}

export function TopHeading({
  children, subheading, image, right, imageFallback,
}: TopHeadingProps) {
  const imageComponent = (image || imageFallback)
    ? <SquareImage className="TopHeading__Image" src={image} fallbackSrc={imageFallback} />
    : undefined;
  return (
    <div className="TopHeading">
      {imageComponent}
      <div className="TopHeading__Content">
        {subheading && <p className="TopHeading__Subheading">{ subheading }</p>}
        <h1 className="TopHeading__Heading">{ children }</h1>
      </div>
      {right && (
      <div className="TopHeading__Right">
        {right}
      </div>
      )}
    </div>
  );
}

TopHeading.defaultProps = {
  image: undefined,
  imageFallback: undefined,
  right: undefined,
};
