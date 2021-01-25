import { Handlers } from './Handlers';

export class DerivedHandlers extends Handlers {
  _derived: Handlers;
  cleanupDerived: any;
  constructor(derived: Handlers) {
    super();
    this._derived = derived;
    this.cleanupDerived = this._derived.listen((bool) => {
      if (!bool) {
        this.disable();
        return;
      }

      this.enable();
    });
  }

  get derived() {
    return {
      connectors: () => this._derived.handlers(),
    };
  }

  cleanup() {
    super.cleanup();
    this.cleanupDerived();
  }
}
