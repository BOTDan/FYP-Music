import React, { PropsWithChildren, ReactNode } from 'react';
import { SquareImage } from './SquareImage';
import './TopHeading.scss';

export interface TopHeadingProps extends PropsWithChildren<{}> {
  subheading: string | ReactNode | undefined;
  image?: string;
}

export function TopHeading({ children, subheading, image }: TopHeadingProps) {
  const imageComponent = image
    ? <SquareImage className="TopHeading__Image" src={image} />
    : undefined;
  return (
    <div className="TopHeading">
      {imageComponent}
      <div className="TopHeading__Content">
        {subheading && <p className="TopHeading__Subheading">{ subheading }</p>}
        <h1 className="TopHeading__Heading">{ children }</h1>
      </div>
    </div>
  );
}

TopHeading.defaultProps = {
  image: undefined,
};
