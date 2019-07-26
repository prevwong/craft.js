import React from 'react';
import { Canvas } from '~packages/core/nodes/Canvas';
import { RootContextProvider } from '~packages/core/root/RootContext';
import { render } from '@testing-library/react';

describe('Canvas', () => {
  it('Covert JSX children into Craft nodes', () => {
   render(
      <RootContextProvider>
        <Canvas>
          <h2>Hi world</h2>
          <h3>Another text</h3>
          <div>
            <h4>Wow</h4>
          </div>
        </Canvas>
     </RootContextProvider>
    )
  });
})