import { Node, CraftComponent } from "~types";
import { node } from "prop-types";
import React, { ReactNode, HTMLProps } from "react";

export * from "./dom";

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



export const TextNode = (props: { text: string }): React.ReactElement => {
    return (
      <React.Fragment>
        {props.text}
      </React.Fragment>
    )
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