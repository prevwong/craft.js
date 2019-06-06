import { Node, Index, id } from "~/types";
import { NodeInfo } from "~types/tree";

export default class Tree {
  node: Node;
  indexes: Index = {};
  id: number = 0;

  build(node: Node, parentIndex?: Index) {
    const { indexes, id } = this;
    const index = (indexes[id] = {
      id,
      node,
      ...(parentIndex && {
        parent: parentIndex.id
      })
    });
    // node.id = id;
    // this.id++;
    const children = node["children"];
    if (children !== undefined) {
      const childrenIds = children.map((childNode, i) => {
        return this.build(childNode, index).id;
      });
      indexes[id]["children"] = childrenIds;
    }

    return index;
  }

  insert(node: Node, parentId: number, position?: number) {
    const parentIndex = this.indexes[parentId],
      parentNode = parentIndex.node;

    if (parentIndex && parentNode.children) {
      position = position ? position : parentNode.children.length;
      const index = this.build(node, parentIndex);
      // node.id = index.id;

      parentNode.children.splice(position, 0, node);
      parentIndex.children.splice(position, 0, index.id);

      return index;
    }
    return null;
  }

  removeIndex(index: Index) {
    delete this.indexes[index.id];
    if (index["children"] && index["children"].length) {
      index["children"].forEach(child =>
        this.removeIndex(this.getIndex(child))
      );
    }
  }
  remove(id: number) {
    const index = this.getIndex(id),
      node = this.get(id);

    if (!index || !node) return;

    const parentIndex = this.getIndex(index.parent),
      parentNode = this.get(index.parent);

    parentNode["children"].splice(parentNode["children"].indexOf(node), 1);
    parentIndex["children"].splice(parentIndex["children"].indexOf(id), 1);

    this.removeIndex(index);
  }

  getIndex(id: number | string) {
    if (this.indexes[+id]) return this.indexes[+id];
    return null;
  }

  get(id: number | string) {
    const index = this.getIndex(+id);
    if (!index) return;
    const { node } = index;
    if (node) return node;
  }

  move(sourceId: number, targetParentId: number, targetPosition: number) {
    const sourceIndex = this.getIndex(sourceId);
    const targetParentIndex = this.getIndex(targetParentId);
    if (!sourceId) return;
    const { parent: sourceParentId } = sourceIndex;
    const sourceParentIndex = this.getIndex(sourceParentId);

    const n = this.insert(sourceIndex.node, targetParentId, targetPosition);
    this.remove(sourceId);
    return n;
  }

  getBoundary(id: number): number {
    const index = this.getIndex(id);
    const { node } = index;

    if (node.droppable === true) {
      return this.getBoundary(index.parent);
    } else {
      return id;
    }
  }

  getDeepChildrenIds(id: id, accumulate: number[] = []): number[] {
    const index = this.getIndex(id);
    const { children } = index;
    if (!children) return accumulate;
    children.forEach(child => {
      const childIndex = this.getIndex(child);
      if (childIndex.node.droppable !== false) {
        accumulate.push(child);
        this.getDeepChildrenIds(child, accumulate);
      }
    });

    return accumulate;
  }

  setInfo(id: id, info: NodeInfo) {
    let node = this.get(id);

    node.info = {
      id,
      ...node.info,
      ...info
    };
  }

  getChildren(id: id) {
    const node = this.get(id);
    if (!node) return null;
    return node.children;
  }
  getInfo(id: id) {
    const node = this.get(id);
    return node.info;
  }

  getChildInfo(deep: boolean = false, rootId: id = 0) {
    const root = this.getIndex(rootId);
    const allChildren = deep ? this.getDeepChildrenIds(root.id) : root.children;
    return allChildren.map(childId => this.get(childId).info);
  }
}
