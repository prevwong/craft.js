import { EventHandlers } from './EventHandlers';
import { ChainableConnectors, EventHandlerUpdates } from './interfaces';

export abstract class DerivedEventHandlers<
  P extends EventHandlers,
  O extends Record<string, any> = {}
> extends EventHandlers {
  derived: P;
  options: O;
  unsubscribeParentHandlerListener: () => void;

  constructor(derived: P, options?: O) {
    super(options);
    this.derived = derived;
    this.options = options;
    this.unsubscribeParentHandlerListener = this.derived.listen((msg) => {
      switch (msg) {
        case EventHandlerUpdates.HandlerEnabled: {
          return this.enable();
        }
        case EventHandlerUpdates.HandlerDisabled: {
          return this.disable();
        }
        default: {
        }
      }
    });
  }

  // A method to easily  inherit parent connectors
  inherit(cb: (connectors: ChainableConnectors<P>) => void) {
    return this.createProxyHandlers(this.derived, cb);
  }

  cleanup() {
    super.cleanup();
    this.unsubscribeParentHandlerListener();
  }
}
