import { DerivedHandlers } from '@craftjs/utils';

import { NodeId } from '../interfaces';
import { CoreEventHandlers } from '../events';

/**
 * Creates Node-specific event handlers and connectors
 */
export class NodeHandlers extends DerivedHandlers<CoreEventHandlers> {
  id;

  constructor(derived: CoreEventHandlers, nodeId: NodeId) {
    super(derived);
    this.id = nodeId;
  }

  handlers() {
    return {
      connect: (el: HTMLElement) => {
        return this.inherit((connectors) => connectors.connect(el, this.id));
      },
      drag: (el: HTMLElement) => {
        return this.inherit((connectors) => connectors.drag(el, this.id));
      },
    };
  }
}

export type NodeConnectors = any;
