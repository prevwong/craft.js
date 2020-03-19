import { wrapHookToRecognizeElement } from "./useConnectorHooks";

class WatchHandler {
  el;
  opts;

  private handler;
  private enabled;
  private unsubscribe;
  private cleanDOM;
  private removeListeners;

  private add() {
    const { init, events } = this.handler;

    this.cleanDOM = init && init(this.el, this.opts);
    this.removeListeners =
      events &&
      events.map(([event, listener, capture]) => {
        const bindedListener = e => {
          listener(e, this.opts);
        };

        this.el.addEventListener(event, bindedListener, capture);
        return () =>
          this.el.removeEventListener(event, bindedListener, capture);
      });
  }

  remove() {
    if (this.cleanDOM) {
      this.cleanDOM();
      this.cleanDOM = null;
    }

    if (this.removeListeners) {
      this.removeListeners.forEach(l => l());
      this.removeListeners = null;
    }
  }

  constructor(store, el, opts, handler) {
    this.el = el;
    this.opts = opts;
    this.handler = handler;

    this.unsubscribe = store.subscribe(() => {
      const { enabled } = store.query.getOptions();
      if (!document.body.contains(el)) {
        this.remove();
        return this.unsubscribe();
      }

      if (this.enabled != enabled) {
        this.enabled = enabled;
        if (enabled) {
          this.add();
        } else {
          this.remove();
        }
      }
    });
  }
}

export abstract class Handlers {
  static wm = new WeakMap();
  editor;
  isEnabled;
  cleanup = [];

  abstract handlers();

  constructor(store) {
    this.editor = store;
  }

  get enabled() {
    return this.isEnabled;
  }

  set enabled(value) {
    this.cleanup.forEach(c => c());
    this.isEnabled = value;
  }

  connectors() {
    const initialHandlers = this.handlers() || {};

    return Object.keys(initialHandlers).reduce((accum, key) => {
      const { init, events } = initialHandlers[key];
      if (!init && !events) {
        accum[key] = () => {};
        return accum;
      }

      const connector = (el, opts) => {
        if (!document.body.contains(el)) {
          Handlers.wm.delete(el);
        }

        const domHandler = Handlers.wm.get(el);
        if (domHandler && domHandler[key]) {
          if (domHandler[key].opts == opts) return;
          domHandler[key].remove();
        }

        Handlers.wm.set(el, {
          ...domHandler,
          [key]: new WatchHandler(this.editor, el, opts, { init, events })
        });
      };

      accum[key] = wrapHookToRecognizeElement(connector);
      return accum;
    }, {});
  }

  static create(...args) {
    const inst = new (this as any)(...args);
    return inst.connectors();
  }
}
