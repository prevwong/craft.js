import { EventHandlers, ChainableConnectors } from './EventHandlers';

export abstract class DerivedEventHandlers<
  P extends EventHandlers,
  O extends Record<string, any> = {}
> extends EventHandlers {
  derived: P;
  options: O;
  cleanupDerived: () => void;

  constructor(derived: P, options: O) {
    super(options);
    this.derived = derived;
    this.options = options;
    this.cleanupDerived = this.derived.listen((bool) => {
      if (!bool) {
        this.disable();
        return;
      }

      this.enable();
    });
  }

  inherit(cb: (connectors: ChainableConnectors<P>) => void) {
    return this.createProxyHandlers(this.derived, cb);
  }

  cleanup() {
    super.cleanup();
    this.cleanupDerived();
  }
}
