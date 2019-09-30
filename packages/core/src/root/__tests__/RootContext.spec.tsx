import React from 'react';
import { render } from '@testing-library/react';
import { RootContext, RootContextProvider, createRootContext } from "../RootContext";

describe('RootContext', () => {
  it('Provides manager store and options', () => {
    let expectedStore;
    const context = createRootContext();
    render(<RootContextProvider context={context}>
      <RootContext.Consumer>
        {(store) => {
          expectedStore = store;
          return null;
        }}
      </RootContext.Consumer>
    </RootContextProvider>)
    expect(expectedStore).toBe(context);
  });
})