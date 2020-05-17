import React, { useEffect } from "react";
import { Element } from "./Element";
import { deprecationWarning } from "@craftjs/utils";

export type Canvas<T extends React.ElementType> = Element<T>;

export const deprecateCanvasComponent = () =>
  deprecationWarning("<Canvas />", {
    suggest: "<Element isCanvas={true} />",
  });

export function Canvas<T extends React.ElementType>({ ...props }: Canvas<T>) {
  useEffect(() => deprecateCanvasComponent(), []);

  return <Element {...props} isCanvas={true} />;
}
