import {
  NodeId,
  NodeEventTypes,
  EditorStore,
  EventQuery,
} from '../../interfaces';

export class EventQueryImpl implements EventQuery {
  private event: Set<NodeId>;

  constructor(private readonly store: EditorStore, type: NodeEventTypes) {
    this.event = store.getState().events[type];
  }

  contains(id: NodeId) {
    return this.event.has(id);
  }

  getState() {
    return this.event;
  }

  getNodes() {
    const nodes = Array.from(this.event);
    return nodes.map((id) => this.store.query.node(id));
  }

  getNodeAtIndex(index: number) {
    const nodes = this.getNodes();
    const node = nodes[index];

    if (!node) {
      return null;
    }

    return node;
  }

  getFirst() {
    return this.getNodeAtIndex(0);
  }

  getLast() {
    return this.getNodeAtIndex(this.event.size > 0 ? this.event.size - 1 : 0);
  }

  isEmpty() {
    return this.event.size === 0;
  }

  size() {
    return this.event.size;
  }

  // ::Deprecated methods below:: //
  first() {
    const values = this.all();
    return values[0];
  }

  last() {
    const values = this.all();
    return values[values.length - 1];
  }

  all() {
    return Array.from(this.event);
  }

  at(i: number) {
    return this.all()[i];
  }

  raw() {
    return this.event;
  }
}
