import React from 'react';
import { useInternalManager } from '../useInternalManager';
import { QueryMethods } from '../query';
import { transformJSXToNode } from '~packages/core/utils/transformJSX';
import { defaultPlaceholder } from '~packages/core/render/RenderPlaceholder';
import { Options, ManagerState } from '~packages/core/interfaces';
import { fireEvent, cleanup, render } from '@testing-library/react';
import Actions from '../actions';
import { ROOT_NODE } from '~packages/core/utils/constants';
import { createRootContext, RootContextProvider } from '~packages/core/root/RootContext';

type TestComponent = {
  collect: (state: ManagerState) => any
  callback: (state: ManagerState) => any,
  click: (e: React.MouseEvent, manager: any) => any
}

const TestComponent: React.FC<Partial<TestComponent>> = ({collect, callback, click}) => {
  const manager = useInternalManager(collect && collect);
  callback(manager);
  return <h3 data-testid="test-click" onClick={
    (e) => click(e, manager)
  }></h3>;
}

describe('useInternalManager', () => {
  const nodes = {
          [ROOT_NODE]: transformJSXToNode(<div />, ROOT_NODE),
          'somenode-1': transformJSXToNode(<h2>Hi</h2>, 'somenode-1')
        },
        options: Options = {
          onRender: ({ render }) => render,
          renderPlaceholder: defaultPlaceholder,
          resolver: {},
          nodes: null
        },
        context = createRootContext({
          nodes,
          options
        });

  let collected: any;

  render(
    <RootContextProvider context={context}>
      <TestComponent collect={(state) => ({ t1: state.nodes['somenode-1'].data, t2: state.nodes[ROOT_NODE].data.type })} callback={(manager) => collected = manager} />
    </RootContextProvider>
  );

  it('Returns options', () => {
    expect(collected).toHaveProperty('options');
    expect(collected.options).toMatchObject(options);
  });

  it('Returns actions', () => {
    const dummyActions = Actions(context.manager.getState().current);
    expect(collected).toHaveProperty('actions');
    expect(Object.keys(collected.actions)).toMatchObject(Object.keys(dummyActions));
  });

  it('Returns queries', () => {
    const dummyQueries = QueryMethods(context.manager.getState().current, options);
    expect(collected).toHaveProperty('query');
    expect(Object.keys(collected.query)).toMatchObject(Object.keys(dummyQueries));
  });

  it('Returns collected states', () => {
    expect(collected).toHaveProperty('t1');
    expect(collected).toHaveProperty('t2');
    expect(collected.t1).toMatchObject(nodes['somenode-1'].data);
    expect(collected.t2).toBe(nodes[ROOT_NODE].data.type);
  });

  it('Re-renders only if collected state changes', () => {
    const mock = (onClick: (manager: any) => any, count: number) => {
      cleanup();
      const mockCount = jest.fn();
      const {queryByTestId} = render(
        <RootContextProvider context={context}>
          <TestComponent
            collect={(state) => ({ t1: state.nodes['somenode-1'].data, t2: state.nodes[ROOT_NODE].data.type })}
            callback={(manager) => {
              mockCount();
              collected = manager
            }}
            click={(e: React.MouseEvent, manager: typeof context.manager) => {
              onClick(manager);
            }}
          />
        </RootContextProvider>
      );
      fireEvent.click(queryByTestId('test-click'));
      expect(mockCount).toHaveBeenCalledTimes(count);
    }

    // Shouldn't re-render when a property changes on a node that isn't watch by a collector
    mock((manager: typeof context.manager) => manager.actions.setRef('somenode-1', (ref => ref.dom = document.body)), 1)

    // This should re-render since t1 watches for data property changes
    mock((manager: typeof context.manager) => manager.actions.setProp('somenode-1', (props) => {
      (props as any).testProp = 3; 
    }), 2);
  })
});