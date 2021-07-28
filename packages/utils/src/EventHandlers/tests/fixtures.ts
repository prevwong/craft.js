import { DerivedEventHandlers } from '../DerivedEventHandlers';
import { EventHandlers } from '../EventHandlers';

export function triggerMouseEvent(node, eventType) {
  const clickEvent = document.createEvent('MouseEvents');
  clickEvent.initEvent(eventType, true, true);
  node.dispatchEvent(clickEvent);
}

export const createTestHandlers = () => {
  jest.clearAllMocks();

  const testHandlers = [
    'connect',
    'select',
    'hover',
    'drag',
    'drop',
    'create',
  ].reduce((accum, key) => {
    const cleanup = jest.fn();
    const init = jest.fn().mockImplementation(() => {
      return cleanup;
    });
    accum[key] = {
      init,
      cleanup,
      events: {
        mousedown: jest.fn().mockImplementation((e) => {
          e.craft.stopPropagation();
        }),
        mouseover: jest.fn(),
      },
    };

    return accum;
  }, {});

  class CoreHandlers extends EventHandlers {
    handlers() {
      return Object.keys(testHandlers).reduce((accum, key) => {
        accum[key] = (el, ...args) => {
          const cleanup = testHandlers[key].init(el, ...args);
          const listenersToRemove = Object.keys(testHandlers[key].events).map(
            (eventName: any) => {
              const removeCraftListener = this.addCraftEventListener(
                el,
                eventName,
                testHandlers[key].events[eventName]
              );
              return () => removeCraftListener();
            }
          );

          return () => {
            cleanup();
            listenersToRemove.forEach((r) => r());
          };
        };
        return accum;
      }, {});
    }
  }

  const instance = new CoreHandlers();

  return {
    instance,
    handlers: testHandlers,
  };
};

export const createTestDerivedHandlers = (core: any) => {
  jest.clearAllMocks();

  const testHandlers = ['connect', 'drag'].reduce((accum, key) => {
    const cleanup = jest.fn();
    const init = jest.fn().mockImplementation(() => cleanup);
    accum[key] = {
      init,
      cleanup,
      events: {
        mousedown: jest.fn(),
        mouseover: jest.fn(),
      },
    };

    return accum;
  }, {});

  class TestDerivedHandlers extends DerivedEventHandlers<any> {
    handlers() {
      return Object.keys(testHandlers).reduce((accum, key) => {
        accum[key] = (el, ...args) => {
          const cleanup = testHandlers[key].init(el, ...args);
          const listenersToRemove = Object.keys(testHandlers[key].events).map(
            (eventName: any) => {
              const removeCraftListener = this.addCraftEventListener(
                el,
                eventName,
                testHandlers[key].events[eventName]
              );

              return () => removeCraftListener();
            }
          );

          const cleanupParent = this.inherit((connectors) => {
            connectors[key](el, ...args);
          });

          return () => {
            cleanup();
            listenersToRemove.forEach((r) => r());
            cleanupParent();
          };
        };

        return accum;
      }, {});
    }
  }

  const instance = new TestDerivedHandlers(core);

  return {
    instance,
    handlers: testHandlers,
  };
};
