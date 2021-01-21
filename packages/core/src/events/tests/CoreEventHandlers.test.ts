import { CoreEventHandlers, DerivedEventHandlers } from '../CoreEventHandlers';
import { defineEventListener } from '../defineEventListener';

function triggerMouseEvent(node, eventType) {
  const clickEvent = document.createEvent('MouseEvents');
  clickEvent.initEvent(eventType, true, true);
  node.dispatchEvent(clickEvent);
}

const createTestCoreHandlers = () => {
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
        mousedown: jest.fn(),
        mouseover: jest.fn(),
      },
    };

    return accum;
  }, {});

  class CoreHandlers extends CoreEventHandlers {
    handlers() {
      return Object.keys(testHandlers).reduce((accum, key) => {
        accum[key] = {
          init: (...args) => {
            return testHandlers[key].init(...args);
          },
          events: Object.keys(testHandlers[key].events).map((eventName) =>
            defineEventListener(eventName, testHandlers[key].events[eventName])
          ),
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

const createTestDerivedHandlers = (core: CoreEventHandlers) => {
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

  class DerivedHandlers extends DerivedEventHandlers {
    handlers() {
      const parentConnectors = this.derived.connectors();

      return Object.keys(testHandlers).reduce((accum, key) => {
        accum[key] = {
          init: (...args) => {
            parentConnectors[key](...args);
            return testHandlers[key].init(...args);
          },
          events: Object.keys(testHandlers[key].events).map((eventName) =>
            defineEventListener(eventName, testHandlers[key].events[eventName])
          ),
        };
        return accum;
      }, {});
    }
  }

  const instance = core.derive(DerivedHandlers);

  return {
    instance,
    handlers: testHandlers,
  };
};

describe('CoreEventHandlers', () => {
  let instance, dom, handlers;

  beforeEach(() => {
    const testEventHandler = createTestCoreHandlers();
    handlers = testEventHandler.handlers;
    instance = testEventHandler.instance;
  });
  describe('connectors', () => {
    it('should have core connectors', () => {
      expect(instance.connectors()).toEqual({
        select: expect.any(Function),
        hover: expect.any(Function),
        drag: expect.any(Function),
        drop: expect.any(Function),
        create: expect.any(Function),
        connect: expect.any(Function),
      });
    });
    describe('attaching a connector', () => {
      dom = document.createElement('a');
      beforeEach(() => {
        instance.connectors().select(dom);
      });

      it('should be able to attach connector', () => {
        const chainedValue = instance.connectors().select(dom);
        expect(chainedValue).toEqual(dom);
        expect(instance.registry['select'].get(dom)).not.toBeFalsy();
        expect(handlers.select.init).toHaveBeenCalled();
      });

      it('should have attached event listeners', () => {
        triggerMouseEvent(dom, 'mousedown');
        expect(handlers.select.events.mousedown).toHaveBeenCalled();

        triggerMouseEvent(dom, 'mouseover');
        expect(handlers.select.events.mouseover).toHaveBeenCalled();
      });

      describe('re-attaching on same DOM element', () => {
        beforeEach(() => {
          jest.clearAllMocks();
        });
        it('should do nothing if opts did not change', () => {
          instance.connectors().select(dom);
          expect(handlers.select.init).not.toHaveBeenCalled();
        });
        it('should reattach connector if opts changed', () => {
          instance.connectors().select(dom, 'node-a');
          expect(handlers.select.cleanup).toHaveBeenCalledTimes(1);
          expect(handlers.select.init).toHaveBeenNthCalledWith(
            1,
            dom,
            'node-a'
          );
        });
      });
    });
  });
  describe('disabling the EventHandler instance', () => {
    dom = document.createElement('a');
    beforeEach(() => {
      Object.keys(instance.connectors()).forEach((key) => {
        instance.connectors()[key](dom);
      });
      jest.clearAllMocks();
      instance.disable();
    });

    it('should only run cleanup', () => {
      Object.keys(instance.connectors()).forEach((key) => {
        expect(handlers[key].cleanup).toHaveBeenCalledTimes(1);
        expect(handlers[key].init).toHaveBeenCalledTimes(0);
      });
    });
    it('should have detached event listeners', () => {
      Object.keys(instance.connectors()).forEach((key) => {
        triggerMouseEvent(dom, 'mousedown');
        expect(handlers[key].events.mousedown).not.toHaveBeenCalled();

        triggerMouseEvent(dom, 'mouseover');
        expect(handlers[key].events.mouseover).not.toHaveBeenCalled();
      });
    });
  });
  describe('re-enabling the EventHandler instance', () => {
    dom = document.createElement('a');
    beforeEach(() => {
      Object.keys(instance.connectors()).forEach((key) => {
        instance.connectors()[key](dom);
      });

      instance.disable();
      jest.clearAllMocks();
      instance.enable();
    });

    it('should only re-attach init', () => {
      Object.keys(instance.connectors()).forEach((key) => {
        expect(handlers[key].cleanup).toHaveBeenCalledTimes(0);
        expect(handlers[key].init).toHaveBeenCalledTimes(1);
      });
    });
    it('should have re-attach event listeners', () => {
      Object.keys(instance.connectors()).forEach((key) => {
        triggerMouseEvent(dom, 'mousedown');
        expect(handlers[key].events.mousedown).toHaveBeenCalled();

        triggerMouseEvent(dom, 'mouseover');
        expect(handlers[key].events.mouseover).toHaveBeenCalled();
      });
    });
  });
  describe('derived handlers', () => {
    let derivedInstance, derivedHandlers;
    beforeEach(() => {
      const testDerivedEventHandler = createTestDerivedHandlers(instance);
      derivedHandlers = testDerivedEventHandler.handlers;
      derivedInstance = testDerivedEventHandler.instance;
    });
    describe('attaching the connector', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        Object.keys(derivedInstance.connectors()).forEach((key) => {
          derivedInstance.connectors()[key](dom);
        });
      });
      it('should be able to attach connector', () => {
        const chainedValue = derivedInstance.connectors().connect(dom);
        expect(chainedValue).toEqual(dom);
        expect(derivedInstance.registry['connect'].get(dom)).not.toBeFalsy();
        expect(derivedHandlers.connect.init).toHaveBeenCalled();
      });
      it('should execute derived and parent connector init methods', () => {
        Object.keys(derivedInstance.connectors()).forEach((key) => {
          expect(handlers[key].init).toHaveBeenCalled();
          expect(derivedHandlers[key].init).toHaveBeenCalled();
        });
      });
      it('should have attached derived and parent event listeners', () => {
        Object.keys(derivedInstance.connectors()).forEach((key) => {
          triggerMouseEvent(dom, 'mousedown');
          expect(handlers[key].events.mousedown).toHaveBeenCalled();
          expect(derivedHandlers[key].events.mousedown).toHaveBeenCalled();

          triggerMouseEvent(dom, 'mouseover');
          expect(handlers[key].events.mouseover).toHaveBeenCalled();
          expect(derivedHandlers[key].events.mouseover).toHaveBeenCalled();
        });
      });
    });
    describe('disabling the parent EventHandler instance', () => {
      dom = document.createElement('a');
      beforeEach(() => {
        Object.keys(derivedInstance.connectors()).forEach((key) => {
          derivedInstance.connectors()[key](dom);
        });
        jest.clearAllMocks();
        instance.disable();
      });

      it('should only run cleanup', () => {
        Object.keys(derivedInstance.connectors()).forEach((key) => {
          expect(derivedHandlers[key].cleanup).toHaveBeenCalledTimes(1);
          expect(derivedHandlers[key].init).toHaveBeenCalledTimes(0);

          expect(handlers[key].cleanup).toHaveBeenCalledTimes(1);
          expect(handlers[key].init).toHaveBeenCalledTimes(0);
        });
      });
      it('should have detached event listeners', () => {
        Object.keys(derivedInstance.connectors()).forEach((key) => {
          triggerMouseEvent(dom, 'mousedown');
          expect(handlers[key].events.mousedown).not.toHaveBeenCalled();
          expect(derivedHandlers[key].events.mousedown).not.toHaveBeenCalled();

          triggerMouseEvent(dom, 'mouseover');
          expect(handlers[key].events.mouseover).not.toHaveBeenCalled();
          expect(derivedHandlers[key].events.mouseover).not.toHaveBeenCalled();
        });
      });
    });
  });
});
