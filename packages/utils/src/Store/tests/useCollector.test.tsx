import { mount } from 'enzyme';
import React, { useMemo, useRef } from 'react';

import { Store } from '../Store';
import { useCollector } from '../useCollector';

describe('useCollector', () => {
  let store: Store, comp, collectors;
  beforeEach(async () => {
    jest.clearAllMocks();
    store = new Store({ value: 0, anotherValue: 1 });

    collectors = {
      collector1: jest.fn(),
      collector2: jest.fn(),
    };

    const TestComponent = () => {
      const collected1 = useCollector(store, (state) => ({
        value: state.value,
      }));
      const collected2 = useCollector(store, (state) => ({
        value: state.anotherValue,
      }));

      const { current: collector1 } = useRef(collectors.collector1);
      const { current: collector2 } = useRef(collectors.collector2);

      useMemo(() => {
        collector1(collected1);
      }, [collected1, collector1]);

      useMemo(() => {
        collector2(collected2);
      }, [collected2, collector2]);

      return null;
    };

    const Parent = ({ enabled }) => {
      if (!enabled) {
        return null;
      }

      return <TestComponent />;
    };

    comp = mount(<Parent enabled={true} />);
  });
  it('should be able to get collected state', async () => {
    expect(collectors.collector1).toHaveBeenCalledWith({ value: 0 });
    expect(collectors.collector2).toHaveBeenCalledWith({
      value: 1,
    });
  });
  it('should be updated only if collected values change', () => {
    store.setState((state) => {
      state.value = 1;
    });
    expect(collectors.collector1).toHaveBeenCalledTimes(2);
    expect(collectors.collector1).toHaveBeenNthCalledWith(1, { value: 0 });
    expect(collectors.collector1).toHaveBeenNthCalledWith(2, { value: 1 });
    expect(collectors.collector2).toHaveBeenCalledTimes(1);
    store.setState((state) => {
      state.anotherValue = 2;
    });
    expect(collectors.collector1).toHaveBeenCalledTimes(2);
    expect(collectors.collector2).toHaveBeenCalledTimes(2);
    expect(collectors.collector2).toHaveBeenNthCalledWith(2, { value: 2 });
  });
  it('should stop updating when component is unmounted', async () => {
    jest.clearAllMocks();
    comp.setProps({ enabled: false });
    store.setState((state) => {
      state.value = 100;
      state.anotherValue = 200;
    });

    expect(collectors.collector1).toHaveBeenCalledTimes(0);
    expect(collectors.collector2).toHaveBeenCalledTimes(0);
  });
});
