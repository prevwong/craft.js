import { NodeId } from '../interfaces';

export class RelatedComponents {
  private elements: Map<NodeId, Map<string, React.ElementType>> = new Map();

  get(id: NodeId, relatedId: string) {
    const node = this.elements.get(id);
    if (!node) {
      return null;
    }

    return node.get(relatedId);
  }

  add(id: NodeId, relatedId: string, type: React.ElementType) {
    let existing = this.elements.get(id);
    if (!existing) {
      this.elements.set(id, new Map());
      existing = this.elements.get(id);
    }

    existing.set(relatedId, type);
    return type;
  }

  clear() {
    this.elements = new Map();
  }
}
