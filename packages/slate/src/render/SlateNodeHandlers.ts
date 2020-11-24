import { NodeId } from '@craftjs/core';
import {
  Handlers,
  ConnectorsForHandlers,
  defineEventListener,
} from '@craftjs/core';

import { createFocusOnNode } from '../utils/createFocusOnNode';

type SlateNodeHandlersProps = {
  elementNodeId: NodeId;
  onDomReady: (dom: HTMLElement) => void;
  onFocus: (focus: any) => void;
};
/**
 * Creates Node-specific event handlers and connectors
 */
export class SlateNodeHandlers extends Handlers<'connect'> {
  props: SlateNodeHandlersProps;

  constructor(store, props: SlateNodeHandlersProps) {
    super(store);
    this.props = props;
  }

  handlers() {
    return {
      connect: {
        init: (el) => {
          this.props.onDomReady(el);
        },
        events: [
          defineEventListener('dblclick', (e) => {
            e.craft.stopPropagation();
            e.stopPropagation();

            const focus = createFocusOnNode(
              this.props.elementNodeId,
              this.store.query
            );

            this.props.onFocus(focus);
          }),
        ],
      },
    };
  }
}

export type SlateNodeConnectors = ConnectorsForHandlers<SlateNodeHandlers>;
