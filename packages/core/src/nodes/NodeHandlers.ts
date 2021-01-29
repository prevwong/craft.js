import { NodeId } from '../interfaces';
import { CoreEventHandlers, DerivedCoreEventHandlers } from '../events';

/**
 * Creates Node-specific event handlers and connectors
 */
export class NodeHandlers extends DerivedCoreEventHandlers<{
  id: NodeId;
}> {
  handlers() {
    return {
      connect: (el: HTMLElement) => {
        return this.inherit((connectors) =>
          connectors.connect(el, this.options.id)
        );
      },
      drag: (el: HTMLElement) => {
        return this.inherit((connectors) =>
          connectors.drag(el, this.options.id)
        );
      },
    };
  }
}

export type NodeEventConnectors = NodeHandlers['connectors'];
