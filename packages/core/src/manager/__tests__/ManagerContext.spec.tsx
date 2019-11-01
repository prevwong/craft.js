import React from 'react';
import { render } from '@testing-library/react';
import { ManagerContext, ManagerContextProvider, createManagerContext } from "../ManagerContext";

describe('RootContext', () => {
  it('Provides manager store and options', () => {
    let expectedStore;
    const context = createManagerContext();
    render(<ManagerContextProvider context={context}>
      <ManagerContext.Consumer>
        {(store) => {
          expectedStore = store;
          return null;
        }}
      </ManagerContext.Consumer>
    </ManagerContextProvider>)
    expect(expectedStore).toBe(context);
  });
})