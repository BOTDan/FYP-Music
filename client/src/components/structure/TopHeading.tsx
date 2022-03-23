import React, { PropsWithChildren, ReactNode } from 'react';
import './TopHeading.scss';

export interface TopHeadingProps extends PropsWithChildren<{}> {
  subheading: string | ReactNode | undefined;
}

export function TopHeading({ children, subheading }: TopHeadingProps) {
  return (
    <div className="TopHeading">
      {subheading && <p className="TopHeading__Subheading">{ subheading }</p>}
      <h1 className="TopHeading__Heading">{ children }</h1>
    </div>
  );
}
