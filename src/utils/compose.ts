import type React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = React.ComponentType<any>;
type HOC = (component: AnyComponent) => AnyComponent;

export function compose(...hocs: HOC[]) {
  return (WrappedComponent: AnyComponent): AnyComponent => {
    return hocs.reduceRight(
      (acc, hoc) => hoc(acc),
      WrappedComponent
    );
  };
}