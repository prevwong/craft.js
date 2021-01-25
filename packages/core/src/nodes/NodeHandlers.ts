import { DerivedHandlers } from '../events/Handlers';

/**
 * Creates Node-specific event handlers and connectors
 */
export class NodeHandlers extends DerivedHandlers {
  id;

  constructor(derived, nodeId) {
    super(derived);
    this.id = nodeId;
  }

  handlers() {
    const parentConnectors = this.derived.connectors();
    return {
      connect: (el) => {
        const cleanup = parentConnectors.connect(el, this.id);
        return () => cleanup();
      },
      drag: (el) => {
        const cleanup = parentConnectors.drag(el, this.id);
        return () => {
          cleanup();
        };
      },
    };
  }
}

export type NodeConnectors = any;
