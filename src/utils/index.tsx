import { Node, CraftComponent } from "~types";
import { node } from "prop-types";
import React from "react";

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
