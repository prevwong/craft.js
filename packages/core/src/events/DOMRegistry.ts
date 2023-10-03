import { NodeId } from '../interfaces';

export class DOMRegistry {
  private dom: Map<NodeId, HTMLElement> = new Map();

  register(id: NodeId, element: HTMLElement) {
    this.dom.set(id, element);
  }

  get(id: NodeId) {
    return this.dom.get(id);
  }

  remove(id: NodeId) {
    return this.dom.delete(id);
  }

  clear() {
    this.dom.clear();
  }
}
