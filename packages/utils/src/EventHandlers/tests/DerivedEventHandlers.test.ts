import {
  createTestDerivedHandlers,
  createTestHandlers,
  triggerMouseEvent,
} from './fixtures';

import { EventHandlers } from '../EventHandlers';
import { ConnectorsUsage } from '../interfaces';

describe('DerivedEventHandlers', () => {
  let dom,
    instance: EventHandlers,
    handlers,
    derivedInstance: EventHandlers,
    derivedHandlers;

  let derivedConnectorsUsage: ConnectorsUsage<typeof derivedInstance>;

  beforeEach(() => {
    dom = document.createElement('a');
    const testEventHandler = createTestHandlers();
    instance = testEventHandler.instance;
    handlers = testEventHandler.handlers;

    const testDerivedEventHandler = createTestDerivedHandlers(instance);
    derivedHandlers = testDerivedEventHandler.handlers;
    derivedInstance = testDerivedEventHandler.instance;
    derivedConnectorsUsage = derivedInstance.createConnectorsUsage();
    derivedConnectorsUsage.register();
  });
  describe('attaching the connector', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      Object.keys(derivedConnectorsUsage.connectors).forEach((key) => {
        derivedConnectorsUsage.connectors[key](dom);
      });
    });
    it('should be able to attach connector', () => {
      const chainedValue = derivedConnectorsUsage.connectors.connect(dom);
      expect(chainedValue).toEqual(dom);
      expect(derivedHandlers.connect.init).toHaveBeenCalled();
    });
    it('should execute derived and parent connector init methods', () => {
      Object.keys(derivedConnectorsUsage.connectors).forEach((key) => {
        expect(handlers[key].init).toHaveBeenCalled();
        expect(derivedHandlers[key].init).toHaveBeenCalled();
      });
    });
    it('should have attached derived and parent event listeners', () => {
      Object.keys(derivedConnectorsUsage.connectors).forEach((key) => {
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
      Object.keys(derivedConnectorsUsage.connectors).forEach((key) => {
        derivedConnectorsUsage.connectors[key](dom);
      });

      jest.clearAllMocks();
      instance.disable();
    });

    it('should only run cleanup', () => {
      Object.keys(derivedConnectorsUsage.connectors).forEach((key) => {
        expect(derivedHandlers[key].cleanup).toHaveBeenCalledTimes(1);
        expect(derivedHandlers[key].init).toHaveBeenCalledTimes(0);

        expect(handlers[key].cleanup).toHaveBeenCalledTimes(1);
        expect(handlers[key].init).toHaveBeenCalledTimes(0);
      });
    });
    it('should have detached event listeners', () => {
      Object.keys(derivedConnectorsUsage.connectors).forEach((key) => {
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
