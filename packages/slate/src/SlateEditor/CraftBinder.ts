import isEqual from 'lodash/isEqual';
import { Operation } from 'slate';

import {
  craftNodeToSlateNode,
  flattenSlateNodes,
  slateNodeToCraftNode,
} from './Nodes';

import { applyIdOnOperation } from '../utils/applyIdOnOperation';
import { getFocusFromSlateRange } from '../utils/createFocusOnNode';

export class CraftBinder {
  options: any;
  applyFromCraft: boolean = false;
  operations: Operation[] = [];
  operationId: string;
  currentSlateState: any;

  constructor(options: any) {
    this.options = options;
    this.setSlateState();
    this.extendSlate();
    this.syncFromCraft();
  }

  getSlateStateFromCraft(query) {
    const nodes = query.getState().nodes;
    const node = query.node(this.options.id).get();
    const childNodes = node.data.nodes;
    return childNodes.map((id) =>
      craftNodeToSlateNode(query.node(id).get(), nodes)
    );
  }

  setSlateState() {
    const { slate } = this.options;
    // console.log('selection', slate.selection);
    slate.selection = null;

    const newState = this.getSlateStateFromCraft(this.options.store.query);
    this.currentSlateState = newState;
    this.options.setValue(newState);
  }

  syncFromCraft() {
    const store = this.options.store;

    const unsubscribe = store.subscribe(
      (_) => {
        const slateState = this.getSlateStateFromCraft(
          this.options.store.query
        );
        return { slateState };
      },
      ({ slateState }) => {
        if (isEqual(this.currentSlateState, slateState)) {
          return;
        }

        this.setSlateState();
      }
    );

    return () => {
      unsubscribe();
    };
  }

  extendSlate() {
    const { slate: rte, store } = this.options;
    const { apply, onChange } = rte;

    rte.onChange = () => {
      onChange();

      if (
        rte.operations.length === 1 &&
        rte.operations[0].type === 'set_selection'
      ) {
        return;
      }

      if (this.applyFromCraft) {
        this.applyFromCraft = false;
        return;
      }

      const flattened = flattenSlateNodes(rte.children, this.options.id);

      this.currentSlateState = rte.children;

      const focus = getFocusFromSlateRange(rte, rte.selection);

      store.actions.history.throttle(500).setState((state) => {
        flattened.forEach((node) => {
          if (!state.nodes[node.id]) {
            state.nodes[node.id] = store.query
              .parseFreshNode(slateNodeToCraftNode(node))
              .toNode();
          }

          state.nodes[node.id].data.props = node.props;
          state.nodes[node.id].data.custom = node.custom;
          state.nodes[node.id].data.nodes = node.nodes;
        });

        state.nodes[this.options.id].data.nodes = rte.children.map(
          (node) => node.id
        );

        state.nodes['ROOT'].data.props.selection = {
          id: this.options.id,
          focus,
        };
      });
    };

    rte.apply = (op) => {
      if (op.type === 'set_selection') {
        apply(op);
        return;
      }

      op = applyIdOnOperation(op);
      apply(op);
    };
  }
}
