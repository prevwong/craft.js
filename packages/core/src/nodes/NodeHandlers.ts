import { DerivedEventHandlers } from '../events';
import { ConnectorsForHandlers } from '@craftjs/utils';

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
          parentConnectors.select(el, this.id);
          parentConnectors.hover(el, this.id);
          parentConnectors.drop(el, this.id);
          this.store.actions.setDOM(this.id, el);
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
