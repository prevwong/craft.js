import isEqual from 'lodash/isEqual';
import shortid from 'shortid';
import { Editor, Operation } from 'slate';

import {
  craftNodeToSlateNode,
  flattenSlateNodes,
  slateNodeToCraftNode,
} from './Nodes';

import { applyIdOnOperation } from '../utils/applyIdOnOperation';

export class CraftBinder {
  options: any;
  applyFromCraft: boolean = false;
  operations: Operation[] = [];
  operationId: string;
  currentSlateState: any;

  constructor(options: any) {
    this.options = options;
    this.initEditor();
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

  initEditor() {
    this.options.setValue(
      this.getSlateStateFromCraft(this.options.store.query)
    );
  }

  syncFromCraft() {
    const rte = this.options.slate;
    const id = this.options.id;
    const store = this.options.store;
    const { query } = store;

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

        const operation = query.history.getTimeline();

        if (!operation) {
          return;
        }
        const { event, isUndo, isRedo } = operation;

        if (!event) {
          return;
        }

        if (event.id !== `RTE-${id}`) {
          return;
        }

        const {
          payload: { operations },
        } = event;

        let operationsToPerform = operations;

        if (!isUndo && !isRedo) {
          return;
        }

        if (isUndo) {
          operationsToPerform = operations.map(Operation.inverse).reverse();
        }

        Editor.withoutNormalizing(rte, () => {
          this.applyFromCraft = true;
          operationsToPerform.forEach((op) => {
            rte.apply(op);
          });
        });
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

      this.currentSlateState = rte.children;

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

      const operations = rte.operations;
      const flattened = flattenSlateNodes(rte.children);

      const id = shortid();
      this.operationId = id;

      store.actions.history
        .withEvent({
          id: `RTE-${this.options.id}`,
          payload: {
            operationId: id,
            operations,
          },
        })
        .setState((state) => {
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
