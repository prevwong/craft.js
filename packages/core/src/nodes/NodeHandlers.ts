import { DerivedEventHandlers } from '../events';
import { ConnectorsForHandlers } from '../utils/Handlers';

/**
 * Creates Node-specific event handlers and connectors
 */
export class NodeHandlers extends DerivedEventHandlers<'connect' | 'drag'> {
  id;

  constructor(store, derived, nodeId) {
    super(store, derived);
    this.id = nodeId;
  }

  handlers() {
    const parentConnectors = this.derived.connectors();
    return {
      connect: {
        init: (el) => {
          parentConnectors.connect(el, this.id);
        },
      },
      drag: {
        init: (el) => {
          parentConnectors.drag(el, this.id);
        },
      },
    };
  }
}

export type NodeConnectors = ConnectorsForHandlers<NodeHandlers>;
