import { Handlers } from "@craftjs/utils";

/**
 * Creates Node-specific connectors
 */
export class NodeHandlers extends Handlers {
  id;
  editorConnectors;

  constructor(store, nodeId, editorConnectors) {
    super(store);
    this.editorConnectors = editorConnectors;
    this.id = nodeId;
  }

  handlers() {
    const parentConnectors = this.editorConnectors;
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
