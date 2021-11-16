import { EditorStore } from '..';
import { NodeId, NodeEventTypes } from '../../interfaces';

export class EventQuery {
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

  /**
   * @deprecated
   */
  first() {
    const values = this.all();
    return values[0];
  }

  /**
   * @deprecated
   */
  last() {
    const values = this.all();
    return values[values.length - 1];
  }

  /**
   * @deprecated
   */
  all() {
    return Array.from(this.event);
  }

  /**
   * @deprecated
   */
  at(i: number) {
    return this.all()[i];
  }

  /**
   * @deprecated
   */
  raw() {
    return this.event;
  }
}
