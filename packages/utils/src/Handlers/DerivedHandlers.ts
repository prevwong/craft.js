import { Handlers, GetChainableConnectors } from './Handlers';

export abstract class DerivedHandlers<P extends Handlers> extends Handlers {
  derived: P;
  cleanupDerived: any;

  constructor(derived: P) {
    super();
    this.derived = derived;
    this.cleanupDerived = this.derived.listen((bool) => {
      if (!bool) {
        this.disable();
        return;
      }

      this.enable();
    });
  }

  inherit(cb: (connectors: GetChainableConnectors<P>) => void) {
    const toCleanup = [];
    const parentHandlers = this.derived.handlers();
    const handlers = new Proxy(parentHandlers, {
      get: (target, key: any, receiver) => {
        if (key in parentHandlers === false) {
          return Reflect.get(target, key, receiver);
        }

        return (el, ...args) => {
          const cleanup = parentHandlers[key](el, ...args);
          toCleanup.push(cleanup);
        };
      },
    });

    cb(handlers as any);

    return () => {
      toCleanup.forEach((c) => c());
    };
  }

  cleanup() {
    super.cleanup();
    this.cleanupDerived();
  }
}
