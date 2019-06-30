import { Node, CraftComponent, CanvasNode, Nodes } from "~types";
import { node } from "prop-types";
import React, { ReactNode, HTMLProps } from "react";
import { TextNode } from "./nodes";

export * from "./nodes";
export * from "./element";

export const isCanvas = (node: any) => !!node.nodes
export const isCraftComponent = (type: any): boolean => !!type.editor;

export const defineReactiveProperty = (obj: any, key: string, val?: string, cb?: Function) => {
    let value = val ? val :  obj[key];

    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function reactiveGetter() {
            return value;
        },
        set: function reactiveSetter(newValue: any) {
            value = newValue;
            if(cb) cb(newValue);
        }
    });
}


export const mapInnerChildren = (children: ReactNode) => {
    return React.Children.toArray(children).reduce(
      (result: any, child: React.ReactElement) => {
        // console.log("child", child);
  
        if (typeof (child) === "string") {
          child = <TextNode text={child} />
        }
        let { type, props } = child;
        let { children, ...otherProps } = (props ? props : {}) as HTMLProps<any>;
        let node: Node = {
          type: type as React.ElementType,
          props: otherProps
        };
        if (children) {
          node.props.children = mapInnerChildren(children);
        }
        result.push(node);
        return result;
      },
      []
    );
  }

export const deleteNode = (nodes: Nodes, node: Node) => {
    const parentId = node.parent,
            parentNodes = (nodes[parentId] as CanvasNode).nodes,
            nodeIndex = parentNodes.indexOf(node.id);

      (nodes[parentId] as CanvasNode).nodes.splice(nodeIndex, 1);
      delete nodes[node.id];
      return nodes;
}

export const addNode = (nodes: Nodes, node: Node) => {
    nodes[node.id] = node;
    return nodes;
}