import { Nodes, CanvasNode, NodeId, Node, NodeData } from "../interfaces";
import { Methods, ActionUnion, ActionByType } from "use-methods";
import { isCanvas, Canvas } from "../nodes";
import { Children } from "react";
import { serializeReducedNode } from "../shared/serializeReducedNode";

/**
 * Manager methods used to query nodes 
 * @param nodes 
 */

export const QueryMethods = (nodes: Nodes) => ({
  getTree(cur="rootNode", canvasName?: string) {
    let tree: any = {};
    const node = nodes[cur];
    if ( !node ) return null;
    const {id } = node;
    tree[id] = {
      ...node
    }
    if ( canvasName ) tree[id].canvasName = canvasName;

    if ( node.data._childCanvas || (node as CanvasNode).data.nodes ) tree[id].children = {};
    if ( node.data._childCanvas ) {
      Object.keys(node.data._childCanvas).forEach(canvasName => {
        const virtualId = node.data._childCanvas[canvasName]
        tree[id].children[virtualId] = this(nodes, virtualId, canvasName);
      });
    } else if ( (node as CanvasNode).data.nodes ) {
      const childNodes = (node as CanvasNode).data.nodes;
      tree[id].nodes = childNodes;
      childNodes.forEach(nodeId => {
        tree[id].children[nodeId] = this(nodes, nodeId);
      });
    }

    return tree[id];
  },
  getDeepNodes(id: NodeId, result: NodeId[] = []) {
    result.push(id);
    const node = nodes[id];
    if ( node.data._childCanvas ) {
      Object.keys(node.data._childCanvas).map(canvasName => {
        const virtualId = node.data._childCanvas[canvasName];
        this(nodes, virtualId, result);
      })
    } else if ( (node as CanvasNode).data.nodes ) {
      const childNodes = (node as CanvasNode).data.nodes;
      childNodes.forEach(nodeId => {
        this(nodes, nodeId, result);
      });
    }
    return result;
  },
  getAllParents(nodeId: NodeId, result:NodeId[] = []) {
    const node = nodes[nodeId];
    const parent = node.data.closestParent;
    if ( parent ) {
      result.push(parent);
      this(nodes, parent, result);
    }
    return result;
  },
  getAllCanvas() {
    return Object.keys(nodes).filter(id => {
      if (isCanvas(nodes[id]) ) return true;
      return false;
    })
  },
  serialize() {
    const simplifiedNodes = Object.keys(nodes).reduce((result: any, id: NodeId ) => {
      const {data: {event, ...data}} = nodes[id];
      result[id] = serializeReducedNode({...data})
      return result;
    }, {});
    
    console.log(JSON.stringify(simplifiedNodes))
  }
});

export type CallbacksFor<M extends Methods> = M extends Methods<any, infer R>
  ? {
      [T in ActionUnion<R>['type']]: (...payload: ActionByType<ActionUnion<R>, T>['payload']) => ReturnType<R[T]>
    }
  : never;

export type QueryMethods = CallbacksFor<typeof QueryMethods>;