import { Handlers } from "@craftjs/utils";

/**
 * Creates Node-specific connectors
 */
export class NodeHandlers extends Handlers {
  id;

  constructor(store, nodeId) {
    super(store);
    this.id = nodeId;
  }

  handlers() {
    const parentConnectors = this.parent.connectors();
    return {
      connect: {
        init: el => {
          parentConnectors.select(el, this.id);
          parentConnectors.hover(el, this.id);
          parentConnectors.drop(el, this.id);
          this.editor.actions.setDOM(this.id, el);
        }
      },
      drag: {
        init: el => {
          parentConnectors.drag(el, this.id);
        }
      }
    };
  }
}
