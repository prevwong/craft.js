import { CoreEventHandlers, DerivedEventHandlers } from '../CoreEventHandlers';
import { defineEventListener } from '../defineEventListener';

function triggerMouseEvent(node, eventType) {
  var clickEvent = document.createEvent('MouseEvents');
  clickEvent.initEvent(eventType, true, true);
  node.dispatchEvent(clickEvent);
}

const createTestHandlers = (connectorNames: string[]) => {
  const handlers = connectorNames.reduce((accum, key) => {
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

  const returnEventHandlersFormat = () => {
    return Object.keys(handlers).reduce(
      (accum, key) => ({
        ...accum,
        [key]: {
          init: handlers[key].init,
          events: Object.keys(handlers[key].events).map((eventName) =>
            defineEventListener(eventName, handlers[key].events[eventName])
          ),
        },
      }),
      {}
    );
  };

  return {
    handlers,
    returnEventHandlersFormat,
  };
};

const createTestCoreHandlers = () => {
  jest.resetAllMocks();

  const { handlers, returnEventHandlersFormat } = createTestHandlers([
    'connect',
    'select',
    'hover',
    'drag',
    'drop',
    'create',
  ]);

  const instance = new (class extends CoreEventHandlers {
    handlers() {
      return returnEventHandlersFormat();
    }
  })();

  return {
    instance,
    handlers,
  };
};

const createTestDerivedHandlers = (core: CoreEventHandlers) => {
  jest.resetAllMocks();

  const { handlers, returnEventHandlersFormat } = createTestHandlers([
    'connect',
    'drag',
  ]);

  class DerivedHandlers extends DerivedEventHandlers<any> {
    handlers() {
      return returnEventHandlersFormat();
    }
  }

  const instance = core.derive(DerivedHandlers);

  return {
    instance,
    handlers,
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
      expect(instance.connectors).toEqual({
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
        instance.connectors.select(dom);
      });

      it('should be able to attach connector', () => {
        const chainedValue = instance.connectors.select(dom);
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
          instance.connectors.select(dom);
          expect(handlers.select.init).not.toHaveBeenCalled();
        });
        it('should reattach connector if opts changed', () => {
          instance.connectors.select(dom, 'node-a');
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
      instance.connectors.select(dom);
      instance.connectors.hover(dom);
      jest.clearAllMocks();
      instance.disable();
    });

    it('should only run cleanup', () => {
      expect(handlers.select.cleanup).toHaveBeenCalledTimes(1);
      expect(handlers.select.init).toHaveBeenCalledTimes(0);

      expect(handlers.hover.cleanup).toHaveBeenCalledTimes(1);
      expect(handlers.hover.init).toHaveBeenCalledTimes(0);
    });
    it('should have detached event listeners', () => {
      triggerMouseEvent(dom, 'mousedown');
      expect(handlers.select.events.mousedown).not.toHaveBeenCalled();

      triggerMouseEvent(dom, 'mouseover');
      expect(handlers.select.events.mouseover).not.toHaveBeenCalled();
    });
  });
  describe('re-enabling the EventHandler instance', () => {
    dom = document.createElement('a');
    beforeEach(() => {
      Object.keys(instance.connectors).forEach((key) => {
        instance.connectors[key](dom);
      });

      instance.disable();
      jest.clearAllMocks();
      instance.enable();
    });

    it('should only re-attach init', () => {
      Object.keys(instance.connectors).forEach((key) => {
        expect(handlers[key].cleanup).toHaveBeenCalledTimes(0);
        expect(handlers[key].init).toHaveBeenCalledTimes(1);
      });
    });
    it('should have re-attach event listeners', () => {
      Object.keys(instance.connectors).forEach((key) => {
        triggerMouseEvent(dom, 'mousedown');
        expect(handlers[key].events.mousedown).toHaveBeenCalled();

        triggerMouseEvent(dom, 'mouseover');
        expect(handlers[key].events.mouseover).toHaveBeenCalled();
      });
    });
  });
  describe('derived handlers', () => {});
});
