import { deprecationWarning } from '@craftjs/utils';
import React, { useEffect } from 'react';

import { Element, ElementProps } from './Element';

export type CanvasProps<T extends React.ElementType> = ElementProps<T>;

export const deprecateCanvasComponent = () =>
  deprecationWarning('<Canvas />', {
    suggest: '<Element canvas={true} />',
  });

export function Canvas<T extends React.ElementType>({
  ...props
}: CanvasProps<T>) {
  useEffect(() => deprecateCanvasComponent(), []);

  return <Element {...props} canvas={true} />;
}
