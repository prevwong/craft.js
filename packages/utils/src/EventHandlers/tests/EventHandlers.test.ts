import { createTestHandlers, triggerMouseEvent } from './fixtures';

import { EventHandlers } from '../EventHandlers';
import { ConnectorsUsage } from '../interfaces';

describe('EventHandlers', () => {
  let instance: EventHandlers, dom, handlers;
  let connectorsUsage: ConnectorsUsage<typeof instance>;

  beforeEach(() => {
    const testEventHandler = createTestHandlers();
    handlers = testEventHandler.handlers;
    instance = testEventHandler.instance;
    connectorsUsage = instance.createConnectorsUsage();
    connectorsUsage.register();
  });
  describe('connectors', () => {
    it('should have core connectors', () => {
      expect(instance.createConnectorsUsage().connectors).toEqual({
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
        connectorsUsage.connectors.select(dom);
      });

      it('should be able to attach connector', () => {
        const chainedValue = connectorsUsage.connectors.select(dom);
        expect(chainedValue).toEqual(dom);
        expect(handlers.select.init).toHaveBeenCalled();
      });

      it('should have attached event listeners', () => {
        triggerMouseEvent(dom, 'mousedown');
        expect(handlers.select.events.mousedown).toHaveBeenCalled();

        triggerMouseEvent(dom, 'mouseover');
        expect(handlers.select.events.mouseover).toHaveBeenCalled();
      });

      describe('stopPropagation', () => {
        let childDom;
        beforeEach(() => {
          jest.clearAllMocks();
          childDom = document.createElement('div');
          dom.appendChild(childDom);
          connectorsUsage.connectors.select(childDom);
          triggerMouseEvent(childDom, 'mousedown');
        });
        it('should stopPropagation on parent DOM element', () => {
          expect(handlers.select.events.mousedown).toHaveBeenCalledTimes(1);
          expect(
            handlers.select.events.mousedown.mock.calls[0][0].target
          ).toEqual(childDom);
        });
      });

      describe('re-attaching on same DOM element', () => {
        beforeEach(() => {
          jest.clearAllMocks();
        });
        it('should do nothing if opts did not change', () => {
          connectorsUsage.connectors.select(dom);
          expect(handlers.select.init).not.toHaveBeenCalled();
        });
        it('should reattach connector if opts changed', () => {
          connectorsUsage.connectors.select(dom, 'node-a');
          expect(handlers.select.cleanup).toHaveBeenCalledTimes(1);
          expect(handlers.select.init).toHaveBeenNthCalledWith(
            1,
            dom,
            'node-a',
            undefined
          );
        });
      });
    });
  });
  describe('disabling the EventHandler instance', () => {
    dom = document.createElement('a');
    beforeEach(() => {
      Object.keys(connectorsUsage.connectors).forEach((key) => {
        connectorsUsage.connectors[key](dom);
      });
      jest.clearAllMocks();
      instance.disable();
    });

    it('should only run cleanup', () => {
      Object.keys(connectorsUsage.connectors).forEach((key) => {
        expect(handlers[key].cleanup).toHaveBeenCalledTimes(1);
        expect(handlers[key].init).toHaveBeenCalledTimes(0);
      });
    });
    it('should have detached event listeners', () => {
      Object.keys(connectorsUsage.connectors).forEach((key) => {
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
      Object.keys(connectorsUsage.connectors).forEach((key) => {
        connectorsUsage.connectors[key](dom);
      });

      instance.disable();
      jest.clearAllMocks();
      instance.enable();
    });

    it('should cleanup existing and re-attach init', () => {
      Object.keys(connectorsUsage.connectors).forEach((key) => {
        expect(handlers[key].cleanup).toHaveBeenCalledTimes(1);
        expect(handlers[key].init).toHaveBeenCalledTimes(1);
      });
    });
    it('should have re-attach event listeners', () => {
      Object.keys(connectorsUsage.connectors).forEach((key) => {
        triggerMouseEvent(dom, 'mousedown');
        expect(handlers[key].events.mousedown).toHaveBeenCalled();

        triggerMouseEvent(dom, 'mouseover');
        expect(handlers[key].events.mouseover).toHaveBeenCalled();
      });
    });
  });
});
