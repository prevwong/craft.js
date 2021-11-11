import { Store } from '../Store';

describe('Store', () => {
  let store: Store;
  beforeEach(() => {
    store = new Store({ testValue: 0 });
  });
  describe('getState', () => {
    it('should return current state', () => {
      expect(store.getState()).toEqual({
        testValue: 0,
      });
    });
  });
  describe('setState', () => {
    it('should be able to mutate state', () => {
      store.setState((state) => {
        state.testValue = 1;
      });
      expect(store.getState()).toEqual({
        testValue: 1,
      });
    });
  });
  describe('subscribe', () => {
    it('should call subscriber only when theres changes to the collected values', () => {
      const subscriber1 = jest.fn();
      const subscriber2 = jest.fn();

      store.subscribe(
        (state) => ({
          collected: state.testValue,
        }),
        subscriber1
      );

      store.subscribe(
        (state) => ({
          collected: state.testValue > 0,
        }),
        subscriber2
      );

      store.setState((state) => {
        state.testValue = 1;
      });

      store.setState((state) => {
        state.testValue = 2;
      });

      expect(subscriber1).toHaveBeenCalledTimes(2);
      expect(subscriber1).toHaveBeenNthCalledWith(1, {
        collected: 1,
      });
      expect(subscriber1).toHaveBeenNthCalledWith(2, {
        collected: 2,
      });
      expect(subscriber2).toHaveBeenCalledTimes(1);
      expect(subscriber2).toHaveBeenNthCalledWith(1, {
        collected: true,
      });
    });
  });
});
