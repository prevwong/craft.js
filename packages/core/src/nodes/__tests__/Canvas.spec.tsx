import React from 'react';
import { Canvas } from '~packages/core/nodes/Canvas';
import { RootContextProvider, createRootContext } from '~packages/core/root/RootContext';
import { render, waitForDomChange, waitForElement, wait, cleanup } from '@testing-library/react';
import { Renderer } from '~packages/core/render';
import { ERROR_ROOT_CANVAS_NO_ID } from '~packages/shared/constants';

beforeEach(() => {
  console.error = jest.fn()
});


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
  describe('Root Canvases', () => {
    const TestComponent = () => {
      return (
        <div>
          <Canvas>
            <h3>Hi</h3>
          </Canvas>
        </div>
      )
    }

    it('throw error when id is ommited', async() => {

      expect(() => render(
        <RootContextProvider context={createRootContext({ nodes: {}, options: { resolver: { TestComponent } } })}>
          <Renderer>
            <Canvas>
              <TestComponent />
            </Canvas>
          </Renderer>
        </RootContextProvider>)).toThrowError(ERROR_ROOT_CANVAS_NO_ID)
    });
  })
})